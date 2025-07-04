import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  subcategories: { id: number; title: string }[];
  activeIndex: number;
  onSelect: (id: number) => void;
};

export default function SubcategoryTabs({
  subcategories,
  activeIndex,
  onSelect,
}: Props) {
  return (
    <FlatList
      horizontal
      data={subcategories}
      keyExtractor={(item) => item.id.toString()}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      renderItem={({ item, index }) => {
        const isActive = index === activeIndex;
        return (
          <TouchableOpacity
            onPress={() => onSelect(item.id)}
            style={styles.tab}
          >
            <Text style={[styles.text, isActive && styles.textActive]}>
              {item.title}
            </Text>
            {isActive && <View style={styles.underline} />}
          </TouchableOpacity>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16 },
  tab: { marginHorizontal: 8, alignItems: "center" },
  text: { fontSize: 14, color: "#666", paddingBottom: 6 },
  textActive: { color: "#000", fontWeight: "600" },
  underline: {
    height: 2,
    width: "100%",
    backgroundColor: "#000",
    borderRadius: 1,
  },
});
