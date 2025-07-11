import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

type Props = {
  tabs: { id: number; title: string }[];
  selectedTabId: number | null;
  onTabPress: (id: number, index: number) => void;
  style?: ViewStyle;
};

export default function CategoryTabs({
  tabs,
  selectedTabId,
  onTabPress,
  style,
}: Props) {
  return (
    <FlatList
      horizontal
      data={tabs}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={[styles.tabsContainer, style]}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item, index }) => {
        const active = selectedTabId === item.id;
        return (
          <TouchableOpacity
            onPress={() => onTabPress(item.id, index)}
            style={[styles.tabButton, active && styles.tabButtonActive]}
          >
            <Text style={[styles.tabText, active && styles.tabTextActive]}>
              {item.title}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  tabsContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
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
