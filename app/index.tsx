import { IMAGE_BASE } from "@/constants";
import { getMarket } from "@/lib/api";
import { Category } from "@/types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StatusBar, StyleSheet } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Carousel from "@/components/Home/Carousel";
import CategoryCard from "@/components/Home/CategoryCard";
import Header from "@/components/Home/Header";
import MarketImage from "@/components/Home/MarketImage";

const HEADER_HEIGHT = 60;
const MARKET_IMAGE_HEIGHT = 160;

export default function HomeScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [marketName, setMarketName] = useState<Record<string, string>>({});
  const [marketImage, setMarketImage] = useState("");
  const { i18n } = useTranslation();

  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);

  useEffect(() => {
    getMarket(4532).then((data) => {
      setCategories(data.marketCategories || []);
      setMarketName(data.name);
      setMarketImage(data.icon?.serverImage || "");
    });
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT],
      [0, -HEADER_HEIGHT],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ translateY }],
    };
  });

  const headerTextAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT / 2, HEADER_HEIGHT],
      [1, 0.3, 0],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  const marketImageAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, MARKET_IMAGE_HEIGHT],
      [0, -50],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      scrollY.value,
      [0, MARKET_IMAGE_HEIGHT / 2, MARKET_IMAGE_HEIGHT],
      [1, 0.6, 0],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ translateY }],
      opacity,
    };
  });

  const totalHeaderHeight = insets.top + HEADER_HEIGHT;

  return (
    <Animated.View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Header
        animatedStyle={headerAnimatedStyle}
        textStyle={headerTextAnimatedStyle}
        title={marketName[i18n.language] || ""}
        height={totalHeaderHeight}
      />
      {marketImage ? (
        <MarketImage
          uri={IMAGE_BASE + marketImage}
          top={totalHeaderHeight}
          animatedStyle={marketImageAnimatedStyle}
        />
      ) : null}

      <Animated.FlatList
        data={categories}
        numColumns={2}
        onScroll={scrollHandler}
        keyExtractor={(item) => item.id.toString()}
        scrollEventThrottle={16}
        ListHeaderComponent={<Carousel categories={categories} />}
        contentContainerStyle={{
          paddingTop:
            totalHeaderHeight + (marketImage ? MARKET_IMAGE_HEIGHT : 0) + 16,
          paddingHorizontal: 10,
          paddingBottom: 50,
        }}
        renderItem={({ item }) => <CategoryCard item={item} />}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
