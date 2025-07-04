import React from "react";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import LoadMoreFooter from "./LoadMoreFooter";
import ProductGridSection from "./ProductGridSection";

type Props = {
  headerHeight: number;
  visibleSubcategories: any[];
  subcategoryLayouts: React.MutableRefObject<Record<number, number>>;
  visibleSubcategoryIndex: number;
  setVisibleSubcategoryIndex: (index: number) => void;
  onEndReached: () => void;
  language: string;
  handleScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  subcategoryListRef: React.RefObject<any>;
  hasMore: boolean;
};

export default function ProductScrollView({
  headerHeight,
  visibleSubcategories,
  subcategoryLayouts,
  visibleSubcategoryIndex,
  setVisibleSubcategoryIndex,
  onEndReached,
  language,
  handleScroll,
  subcategoryListRef,
  hasMore,
}: Props) {
  return (
    <Animated.ScrollView
      entering={FadeInUp}
      contentContainerStyle={{
        paddingTop: headerHeight + 82,
        paddingBottom: 100,
      }}
      onScroll={(e) => {
        const y = e.nativeEvent.contentOffset.y;
        let lastVisibleIndex = 0;

        for (let i = 0; i < visibleSubcategories.length; i++) {
          const layoutY =
            subcategoryLayouts.current[visibleSubcategories[i].id];
          if (layoutY !== undefined && layoutY - 30 <= y) {
            lastVisibleIndex = i;
          }
        }

        if (lastVisibleIndex !== visibleSubcategoryIndex) {
          setVisibleSubcategoryIndex(lastVisibleIndex);
          subcategoryListRef.current?.scrollToIndex({
            index: lastVisibleIndex,
            viewPosition: 0.5,
            animated: true,
          });
        }

        handleScroll(e);
      }}
      onMomentumScrollEnd={onEndReached}
    >
      {visibleSubcategories.map((subcategory, index) => (
        <Animated.View
          key={subcategory.id}
          onLayout={(e) => {
            subcategoryLayouts.current[subcategory.id] = e.nativeEvent.layout.y;
          }}
          entering={FadeInUp.delay(index * 100)}
        >
          <ProductGridSection
            title={subcategory.title}
            data={subcategory.data}
            language={language}
          />
        </Animated.View>
      ))}

      {hasMore && <LoadMoreFooter loading />}
    </Animated.ScrollView>
  );
}
