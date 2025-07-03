import { IMAGE_BASE } from "@/constants";
import { Category } from "@/types";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";

type Props = {
  item: Category;
};

export default function CategoryCard({ item }: Props) {
  const router = useRouter();
  const { i18n } = useTranslation();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/market/${item.id}`)}
    >
      <Image
        source={{ uri: IMAGE_BASE + item.serverImageUrl }}
        style={styles.image}
      />
      <BlurView intensity={30} tint="light" style={styles.nameBlur}>
        <Text style={styles.name}>{item.name[i18n.language]}</Text>
      </BlurView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
});
