import { getCategoryItems, getMarket } from "@/lib/api";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const IMAGE_BASE = "https://im-staging.haat.delivery/";

export default function MarketDetail() {
  const { id } = useLocalSearchParams();
  const categoryId = parseInt(id as string);

  const [market, setMarket] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    categoryId
  );
  const [sectionData, setSectionData] = useState([]);
  const sectionListRef = useRef<SectionList>(null);

  useEffect(() => {
    const load = async () => {
      const data = await getMarket(4532);
      setMarket(data);

      const allSections = await Promise.all(
        data.categories.map(async (cat) => {
          const subItems = await getCategoryItems(4532, cat.id);
          const grouped = subItems.categories.map((sub) => ({
            title: sub.name,
            categoryId: cat.id,
            subCategoryId: sub.id,
            data: sub.items,
          }));
          return grouped;
        })
      );

      setSectionData(allSections.flat());
    };

    load();
  }, []);

  const scrollToCategory = (catId: number) => {
    const index = sectionData.findIndex((s) => s.categoryId === catId);
    if (index !== -1) {
      sectionListRef.current?.scrollToLocation({
        sectionIndex: index,
        itemIndex: 0,
        animated: true,
      });
      setSelectedCategoryId(catId);
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    const first = viewableItems.find((vi) => vi.section);
    if (first) {
      setSelectedCategoryId(first.section.categoryId);
    }
  });

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 10 });

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={market?.categories || []}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        style={styles.topTabs}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => scrollToCategory(item.id)}
            style={[
              styles.categoryTab,
              selectedCategoryId === item.id && styles.activeCategoryTab,
            ]}
          >
            <Text
              style={
                selectedCategoryId === item.id
                  ? styles.activeTabText
                  : styles.tabText
              }
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />

      <SectionList
        ref={sectionListRef}
        sections={sectionData}
        keyExtractor={(item, index) => item.id?.toString() + index}
        stickySectionHeadersEnabled={true}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewConfigRef.current}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.subHeader}>
            <Text style={styles.subHeaderText}>{title}</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <Image
              source={{ uri: IMAGE_BASE + item.image }}
              style={styles.itemImage}
            />
            <Text style={styles.itemName}>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  topTabs: {
    backgroundColor: "#fff",
    paddingVertical: 10,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  activeCategoryTab: {
    backgroundColor: "#d32f2f",
  },
  tabText: {
    color: "#333",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "bold",
  },
  subHeader: {
    backgroundColor: "#fff",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  subHeaderText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  itemCard: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },
  itemName: {
    fontSize: 16,
  },
});
