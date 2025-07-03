import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  sections: { id: number; title: string }[];
  selectedTabId: number | null;
  onTabPress: (id: number, index: number) => void;
  top: number;
};

export default function Tabs({
  sections,
  selectedTabId,
  onTabPress,
  top,
}: Props) {
  return (
    <View
      style={[
        styles.tabsWrapper,
        { top, zIndex: 10, position: "absolute", backgroundColor: "#fff" },
      ]}
    >
      <FlatList
        horizontal
        data={sections}
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContainer}
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
    </View>
  );
}

const styles = StyleSheet.create({
  tabsWrapper: {
    width: "100%",
    paddingVertical: 8,
  },
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
