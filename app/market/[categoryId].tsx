import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CategoryTabs from "@/components/CategoryDetail/CategoryTabs";
import CategoryHeader from "@/components/CategoryDetail/Header";
import ProductScrollView from "@/components/CategoryDetail/ProductSectionList";
import SubcategoryTabs from "@/components/CategoryDetail/SubcategoryTabs";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { getMarket } from "@/lib/api";
import { Category } from "@/types";

const chunkArray = (arr: any[], size: number) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

const PAGE_SIZE = 10;

export default function CategoryDetailScreen() {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const insets = useSafeAreaInsets();
  const { i18n } = useTranslation();
  const { showScrollTop, handleScroll } = useScrollToTop();

  const categoryListRef = useRef<FlatList<any>>(null);
  const subcategoryListRef = useRef<FlatList<any>>(null);
  const subcategoryLayouts = useRef<Record<number, number>>({});

  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [visibleSubcategoryCount, setVisibleSubcategoryCount] = useState(1);
  const [visibleSubcategoryIndex, setVisibleSubcategoryIndex] = useState(0);
  const [marketName, setMarketName] = useState("");
  const [loading, setLoading] = useState(true);

  const headerHeight = 60 + insets.top;
  const visibleSubcategories = subcategories.slice(0, visibleSubcategoryCount);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await getMarket(4532);
        setMarketName(data.name?.[i18n.language] ?? "");

        const cats = (data.marketCategories ?? []).map((cat: Category) => ({
          id: cat.id,
          title: cat.name?.[i18n.language] ?? "",
          subcategories: cat.marketSubcategories ?? [],
        }));

        setCategories(cats);
        const initialCategoryId = Number(categoryId) || cats[0]?.id || null;
        setSelectedCategoryId(initialCategoryId);

        requestAnimationFrame(() => {
          const categoryIndex = cats.findIndex(
            (c) => c.id === initialCategoryId
          );
          if (categoryIndex >= 0) {
            categoryListRef.current?.scrollToIndex({
              index: categoryIndex,
              viewPosition: 0.5,
              animated: true,
            });
          }
        });
      } catch (e) {
        console.error("Failed to load market:", e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [categoryId]);

  useEffect(() => {
    if (!selectedCategoryId) return;

    const category = categories.find((c) => c.id === selectedCategoryId);
    if (!category) return;

    const subs = (category.subcategories ?? []).map((subcat: any) => {
      const allProducts = subcat.products ?? [];
      return {
        id: subcat.id,
        title: subcat.name?.[i18n.language] ?? "",
        products: allProducts,
        data: chunkArray(allProducts.slice(0, PAGE_SIZE), 2),
        page: 1,
        hasMore: allProducts.length > PAGE_SIZE,
      };
    });

    setSubcategories(subs);
    setVisibleSubcategoryCount(1);
    setVisibleSubcategoryIndex(0);
  }, [selectedCategoryId, categories]);

  const loadMoreProducts = (subcatId: number) => {
    setSubcategories((prev) =>
      prev.map((subcat) => {
        if (subcat.id !== subcatId) return subcat;
        const nextPage = subcat.page + 1;
        const nextData = chunkArray(
          subcat.products.slice(0, nextPage * PAGE_SIZE),
          2
        );
        return {
          ...subcat,
          page: nextPage,
          data: nextData,
          hasMore: nextData.length < subcat.products.length,
        };
      })
    );
  };

  const scrollToSubcategory = (id: number) => {
    const index = subcategories.findIndex((s) => s.id === id);
    if (index >= 0) {
      setVisibleSubcategoryIndex(index);
      setVisibleSubcategoryCount(index + 1);

      requestAnimationFrame(() => {
        subcategoryListRef.current?.scrollToIndex({
          index,
          viewPosition: 0.5,
          animated: true,
        });
      });
    }
  };

  const onEndReached = () => {
    const current = subcategories[visibleSubcategoryCount - 1];
    if (!current) return;

    if (current.hasMore) {
      loadMoreProducts(current.id);
    } else if (visibleSubcategoryCount < subcategories.length) {
      setVisibleSubcategoryCount(visibleSubcategoryCount + 1);
    } else {
      const currentCategoryIndex = categories.findIndex(
        (c) => c.id === selectedCategoryId
      );
      const nextCategory = categories[currentCategoryIndex + 1];
      if (nextCategory) {
        setSelectedCategoryId(nextCategory.id);

        requestAnimationFrame(() => {
          categoryListRef.current?.scrollToIndex({
            index: currentCategoryIndex + 1,
            viewPosition: 0.5,
            animated: true,
          });
        });
      }
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <CategoryHeader
        title={marketName}
        paddingTop={insets.top}
        height={headerHeight}
      />

      <View style={[styles.tabsWrapper, { top: 55 + insets.top }]}>
        <CategoryTabs
          categories={categories}
          selectedId={selectedCategoryId}
          onSelect={setSelectedCategoryId}
        />
      </View>

      <View style={[styles.subTabsWrapper, { top: 55 + 56 + insets.top }]}>
        <SubcategoryTabs
          subcategories={subcategories}
          activeIndex={visibleSubcategoryIndex}
          onSelect={scrollToSubcategory}
        />
      </View>
      <ProductScrollView
        headerHeight={headerHeight}
        visibleSubcategories={visibleSubcategories}
        subcategoryLayouts={subcategoryLayouts}
        visibleSubcategoryIndex={visibleSubcategoryIndex}
        setVisibleSubcategoryIndex={setVisibleSubcategoryIndex}
        onEndReached={onEndReached}
        language={i18n.language}
        handleScroll={handleScroll}
        subcategoryListRef={subcategoryListRef}
        hasMore={subcategories[visibleSubcategoryCount - 1]?.hasMore}
      />

      <ScrollToTopButton
        visible={showScrollTop}
        onPress={() => {
          setVisibleSubcategoryCount(1);
          setVisibleSubcategoryIndex(0);

          requestAnimationFrame(() => {
            subcategoryListRef.current?.scrollToIndex({
              index: 0,
              viewPosition: 0.5,
              animated: true,
            });
          });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  tabsWrapper: {
    position: "absolute",
    width: "100%",
    paddingVertical: 8,
    backgroundColor: "#fff",
    zIndex: 11,
  },
  subTabsWrapper: {
    position: "absolute",
    width: "100%",
    paddingVertical: 6,
    backgroundColor: "#fff",
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
});
