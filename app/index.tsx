import { getMarket } from "@/lib/api";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const IMAGE_BASE = "https://im-staging.haat.delivery/";
const HEADER_HEIGHT = 60;

export default function HomeScreen() {
  const [categories, setCategories] = useState([]);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const scrollY = useSharedValue(0);

  useEffect(() => {
    getMarket(4532).then((data) => {
      setCategories(data.marketCategories);
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
  const totalHeaderHeight = insets.top + HEADER_HEIGHT;

  return (
    <Animated.View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Animated.View
        style={[
          styles.header,
          {
            paddingTop: insets.top,
            height: totalHeaderHeight,
          },
          headerAnimatedStyle,
        ]}
      >
        <Animated.Text style={[styles.headerText, headerTextAnimatedStyle]}>
          Available Categories
        </Animated.Text>
      </Animated.View>
      <Animated.FlatList
        data={categories}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: totalHeaderHeight + 10,
          paddingHorizontal: 10,
          paddingBottom: 24,
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/market/${item.id}`)}
          >
            <Image
              source={{ uri: IMAGE_BASE + item.serverImageUrl }}
              style={styles.image}
            />
            <BlurView intensity={30} tint="light" style={styles.nameBlur}>
              <Text style={styles.name}>{item.name["en-US"]}</Text>
            </BlurView>
          </TouchableOpacity>
        )}
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
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 10,
  },
  image: {
    height: 100,
    width: "100%",
    resizeMode: "cover",
  },
  name: {
    padding: 8,
    textAlign: "left",
    color: "#000",
    fontWeight: "bold",
    fontSize: 14,
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
});
