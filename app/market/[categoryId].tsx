import Header from "@/components/CategoryDetail/Header";
import LoadMoreFooter from "@/components/CategoryDetail/LoadMoreFooter";
import ProductCard from "@/components/CategoryDetail/ProductCard";
import Tabs from "@/components/CategoryDetail/Tabs";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { getCategoryDetail } from "@/lib/api";
import type { Product, SectionType } from "@/types";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  SectionList,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PAGE_SIZE = 10;

export default function CategoryDetailScreen() {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const insets = useSafeAreaInsets();
  const listRef = useRef<SectionList<Product>>(null);
  const { showScrollTop, handleScroll } = useScrollToTop();
  const { i18n, t } = useTranslation();

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
        const section = item.section as SectionType;
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
        const { categoryData, sections } = await getCategoryDetail(
          categoryId!,
          i18n.language,
          PAGE_SIZE
        );

        setData(categoryData);
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

  const handleTabPress = (id: number, index: number) => {
    setSelectedTabId(id);
    listRef.current?.scrollToLocation({
      sectionIndex: index,
      itemIndex: 0,
      viewPosition: 0,
      viewOffset: totalOffset,
      animated: true,
    });
  };

  if (loading || !data) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }
  return (
    <View style={styles.container}>
      <Header
        title={data.name?.[i18n.language] ?? "Category"}
        paddingTop={insets.top}
        height={headerHeight}
      />

      <Tabs
        sections={sectionsData}
        selectedTabId={selectedTabId}
        onTabPress={handleTabPress}
        top={headerHeight}
      />

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
          <ProductCard name={item.name?.[i18n.language] ?? "Unnamed item"} />
        )}
        renderSectionFooter={({ section }) => {
          const current = sectionsData.find((s) => s.id === section.id);
          if (!current?.hasMore) return null;

          return (
            <LoadMoreFooter
              loadingMore={current.loadingMore ?? false}
              loadingText={t("loadingMore")}
            />
          );
        }}
      />
      <ScrollToTopButton visible={showScrollTop} onPress={scrollToLocation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

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
});
