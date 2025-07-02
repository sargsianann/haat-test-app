import ScrollToTopButton from "@/components/ScrollToTopButton";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { BlurView } from "expo-blur";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const API_URL =
  "https://user-new-app-staging.internal.haat.delivery/api/markets/4532/categories/";

type SectionType = {
  id: number;
  title: string;
  allProducts: any[];
  data: any[];
  page: number;
  hasMore: boolean;
  loadingMore?: boolean;
};

const PAGE_SIZE = 10;

export default function CategoryDetailScreen() {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const insets = useSafeAreaInsets();
  const listRef = useRef<SectionList<any>>(null);
  const { showScrollTop, handleScroll } = useScrollToTop();

  const [data, setData] = useState<any>(null);
  const [sectionsData, setSectionsData] = useState<SectionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTabId, setSelectedTabId] = useState<number | null>(null);

  const headerHeight = 60 + insets.top;
  const tabBarHeight = 56;
  const totalOffset = headerHeight + tabBarHeight;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const topSection = viewableItems.find((v) => v.section && v.index === 0);
      if (topSection?.section?.id) {
        setSelectedTabId(topSection.section.id);
      }

      viewableItems.forEach((item) => {
        if (!item.section) return;
        const section = item.section;
        if (
          section.hasMore &&
          !section.loadingMore &&
          item.index === section.data.length - 1
        ) {
          loadMore(section.id);
        }
      });
    }
  ).current;

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}${categoryId}`);
        const json = await res.json();
        setData(json);

        const sections: SectionType[] = (json.marketSubcategories ?? []).map(
          (sub: any) => {
            const allProducts = sub.products ?? [];
            return {
              id: sub.id,
              title: sub.name?.["en-US"] ?? "",
              allProducts,
              data: allProducts.slice(0, PAGE_SIZE),
              page: 1,
              hasMore: allProducts.length > PAGE_SIZE,
              loadingMore: false,
            };
          }
        );

        setSectionsData(sections);
        if (sections[0]?.id) setSelectedTabId(sections[0].id);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [categoryId]);

  const scrollToLocation = () => {
    listRef.current?.scrollToLocation({
      sectionIndex: 0,
      itemIndex: 0,
      animated: true,
    });
  };
  const loadMore = (sectionId: number) => {
    setSectionsData((prev) =>
      prev.map((section) => {
        if (section.id !== sectionId || !section.hasMore || section.loadingMore)
          return section;

        const nextPage = section.page + 1;
        const nextData = section.allProducts.slice(0, nextPage * PAGE_SIZE);

        return {
          ...section,
          data: nextData,
          page: nextPage,
          hasMore: nextData.length < section.allProducts.length,
          loadingMore: false,
        };
      })
    );
  };

  if (loading || !data) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <BlurView
        intensity={50}
        tint="light"
        style={[
          styles.header,
          { paddingTop: insets.top, height: headerHeight },
        ]}
      >
        <Text style={styles.headerTitle}>
          {data.name?.["en-US"] ?? "Category"}
        </Text>
      </BlurView>

      <View
        style={[
          styles.tabsWrapper,
          {
            top: headerHeight,
            zIndex: 10,
            position: "absolute",
            backgroundColor: "#fff",
          },
        ]}
      >
        <FlatList
          horizontal
          data={sectionsData}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
          renderItem={({ item, index }) => {
            const active = selectedTabId === item.id;
            return (
              <TouchableOpacity
                onPress={() => {
                  setSelectedTabId(item.id);
                  listRef.current?.scrollToLocation({
                    sectionIndex: index,
                    itemIndex: 0,
                    viewPosition: 0,
                    viewOffset: totalOffset,
                    animated: true,
                  });
                }}
                style={[styles.tabButton, active && styles.tabButtonActive]}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <SectionList
        ref={listRef}
        sections={sectionsData.map(({ allProducts, ...rest }) => rest)}
        keyExtractor={(item) => item.id.toString()}
        stickySectionHeadersEnabled={false}
        onViewableItemsChanged={onViewableItemsChanged}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        windowSize={10}
        onScroll={handleScroll}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
          waitForInteraction: false,
          minimumViewTime: 100,
        }}
        contentContainerStyle={{
          paddingTop: totalOffset + 8,
          paddingBottom: 100,
        }}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <BlurView intensity={40} tint="light" style={styles.itemCard}>
              <Text style={styles.itemName}>
                {item.name?.["en-US"] ?? "Unnamed item"}
              </Text>
            </BlurView>
          </View>
        )}
        renderSectionFooter={({ section }) => {
          const current = sectionsData.find((s) => s.id === section.id);
          if (!current?.hasMore) return null;

          return (
            <View style={styles.loadMoreFooter}>
              {current.loadingMore ? (
                <ActivityIndicator size="small" color="#007AFF" />
              ) : (
                <Text style={styles.loadMoreText}>Loading more...</Text>
              )}
            </View>
          );
        }}
      />
      <ScrollToTopButton visible={showScrollTop} onPress={scrollToLocation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ddd",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },

  tabsWrapper: {
    width: "100%",
    paddingVertical: 8,
  },
  tabsContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tabButton: {
    paddingHorizontal: 14,
    justifyContent: "center",
    height: 40,
    borderRadius: 20,
    backgroundColor: "#eee",
    marginRight: 10,
  },
  tabButtonActive: {
    backgroundColor: "#efa1aa",
  },
  tabText: {
    fontSize: 14,
    color: "#333",
  },
  tabTextActive: {
    color: "#fff",
    fontWeight: "600",
  },

  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },

  itemRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  itemCard: {
    flex: 1,
    height: 100,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    overflow: "hidden",
    backgroundColor: "#f2f2f2",
  },
  itemName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
    textAlign: "center",
  },

  loadMoreFooter: {
    paddingVertical: 16,
    alignItems: "center",
  },
  loadMoreText: {
    color: "#007AFF",
    fontWeight: "500",
  },
});
