import { FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";

type Props = {
  categories: { id: number; title: string }[];
  selectedId: number | null;
  onSelect: (id: number) => void;
};

export default function CategoryTabs({
  categories,
  selectedId,
  onSelect,
}: Props) {
  return (
    <FlatList
      horizontal
      data={categories}
      keyExtractor={(item) => item.id.toString()}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => {
        const isActive = item.id === selectedId;
        return (
          <TouchableOpacity
            onPress={() => onSelect(item.id)}
            style={[styles.tabButton, isActive && styles.tabButtonActive]}
          >
            <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
              {item.title}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, gap: 8 },
  tabButton: {
    paddingHorizontal: 14,
    justifyContent: "center",
    height: 40,
    borderRadius: 20,
    backgroundColor: "#eee",
    marginRight: 10,
  },
  tabButtonActive: {
    backgroundColor: "#efa1aa",
  },
  tabText: {
    fontSize: 14,
    color: "#333",
  },
  tabTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
});
