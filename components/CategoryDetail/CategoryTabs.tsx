import { useEffect, useRef } from "react";
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
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!selectedId || categories.length === 0) return;

    const index = categories.findIndex((c) => c.id === selectedId);
    if (index >= 0 && listRef.current) {
      try {
        listRef.current.scrollToIndex({
          index,
          viewPosition: 0.5,
          animated: true,
        });
      } catch (err) {
        console.warn("scrollToIndex failed in CategoryTabs:", err);
      }
    }
  }, [selectedId, categories]);

  return (
    <FlatList
      ref={listRef}
      horizontal
      data={categories}
      keyExtractor={(item) => item.id.toString()}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      getItemLayout={(_, index) => ({
        length: 100,
        offset: 100 * index,
        index,
      })}
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
