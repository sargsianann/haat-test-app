import { IMAGE_BASE } from "@/constants";
import { BlurView } from "expo-blur";
import { Image, StyleSheet, Text, View } from "react-native";

type Props = {
  product: any;
  language: string;
};

export default function ProductCard({ product, language }: Props) {
  const imageUrl = product.productImages?.[0]?.serverImageUrl;

  return (
    <View style={styles.wrapper}>
      <BlurView intensity={40} tint="light" style={styles.card}>
        {imageUrl && (
          <Image
            source={{ uri: IMAGE_BASE + imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
        <Text style={styles.name}>{product.name?.[language] ?? "Unnamed"}</Text>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, marginHorizontal: 4 },
  card: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    padding: 12,
  },
  image: {
    width: "100%",
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
    textAlign: "center",
  },
});
