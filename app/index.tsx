import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { getMarket } from "@/lib/api";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const IMAGE_BASE = "https://im-staging.haat.delivery/";
const HEADER_HEIGHT = 60;
const MARKET_IMAGE_HEIGHT = 160;

type Category = {
  id: number;
  name: Record<string, string>;
  serverImageUrl: string;
  smallImageUrl?: string;
};

export default function HomeScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [marketName, setMarketName] = useState<Record<string, string>>({});
  const [marketImage, setMarketImage] = useState("");
  const { scrollRef, showScrollTop, handleScroll } = useScrollToTop();
  const { i18n } = useTranslation();

  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);

  useEffect(() => {
    getMarket(4532).then((data) => {
      setCategories(data.marketCategories || []);
      setMarketName(data.name);
      setMarketImage(data.icon?.serverImage || "");
    });
  }, []);

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

      <Animated.View
        style={[
          styles.header,
          { paddingTop: insets.top, height: totalHeaderHeight },
          headerAnimatedStyle,
        ]}
      >
        <Animated.Text style={[styles.headerText, headerTextAnimatedStyle]}>
          {marketName[i18n.language]}
        </Animated.Text>
        <LanguageSwitcher />
      </Animated.View>
      {marketImage && (
        <Animated.Image
          source={{ uri: IMAGE_BASE + marketImage }}
          style={[
            styles.marketImage,
            { top: totalHeaderHeight, position: "absolute", zIndex: 50 },
            marketImageAnimatedStyle,
          ]}
        />
      )}
      <Animated.FlatList
        ref={scrollRef}
        data={categories}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ListHeaderComponent={
          <FlatList
            data={categories}
            horizontal
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContainer}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.carouselItem} onPress={() => {}}>
                <Image
                  source={{
                    uri: IMAGE_BASE + item.serverImageUrl || item.smallImageUrl,
                  }}
                  style={styles.carouselImage}
                />
                <Text style={styles.carouselLabel}>
                  {item.name[i18n.language] || ""}
                </Text>
              </TouchableOpacity>
            )}
          />
        }
        contentContainerStyle={{
          paddingTop:
            totalHeaderHeight + (marketImage ? MARKET_IMAGE_HEIGHT : 0) + 16,
          paddingHorizontal: 10,
          paddingBottom: 50,
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              router.push(`/market/${item.id}`);
            }}
          >
            <Image
              source={{ uri: IMAGE_BASE + item.serverImageUrl }}
              style={styles.image}
            />
            <BlurView intensity={30} tint="light" style={styles.nameBlur}>
              <Text style={styles.name}>{item.name[i18n.language]}</Text>
            </BlurView>
          </TouchableOpacity>
        )}
      />
      <ScrollToTopButton
        visible={showScrollTop}
        onPress={() => {
          scrollRef.current?.scrollToOffset({ offset: 0, animated: true });
        }}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    zIndex: 100,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  marketImage: {
    width: "100%",
    height: MARKET_IMAGE_HEIGHT,
    resizeMode: "cover",
  },
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 10,
    backgroundColor: "#fff",
    overflow: "hidden",
    elevation: 2,
  },
  image: {
    height: 100,
    width: "100%",
    resizeMode: "cover",
  },
  nameBlur: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 4,
    paddingHorizontal: 6,
    backgroundColor: "transparent",
  },
  name: {
    padding: 8,
    textAlign: "left",
    color: "#000",
    fontWeight: "bold",
    fontSize: 14,
  },
  carouselContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  carouselItem: {
    alignItems: "center",
    marginRight: 16,
    width: 70,
  },
  carouselImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    resizeMode: "cover",
    marginBottom: 6,
    backgroundColor: "#eee",
  },
  carouselLabel: {
    fontSize: 12,
    textAlign: "center",
    color: "#333",
  },
});
