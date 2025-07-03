import { IMAGE_BASE } from "@/constants";
import { Category } from "@/types";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

type Props = {
  categories: Category[];
};

export default function Carousel({ categories }: Props) {
  const { i18n } = useTranslation();

  return (
    <FlatList
      data={categories}
      horizontal
      keyExtractor={(item) => item.id.toString()}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.item} onPress={() => {}}>
          <Image
            source={{
              uri: IMAGE_BASE + (item.serverImageUrl || item.smallImageUrl),
            }}
            style={styles.image}
          />
          <Text style={styles.label}>{item.name[i18n.language] || ""}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  item: {
    alignItems: "center",
    marginRight: 16,
    width: 70,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    resizeMode: "cover",
    marginBottom: 6,
    backgroundColor: "#eee",
  },
  label: {
    fontSize: 12,
    textAlign: "center",
    color: "#333",
  },
});
