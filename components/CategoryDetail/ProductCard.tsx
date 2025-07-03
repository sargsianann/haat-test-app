import { BlurView } from "expo-blur";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  name: string;
};

export default function ProductCard({ name }: Props) {
  return (
    <View style={styles.itemRow}>
      <BlurView intensity={40} tint="light" style={styles.itemCard}>
        <Text style={styles.itemName}>{name}</Text>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  itemRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  itemCard: {
    flex: 1,
    height: 100,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    overflow: "hidden",
    backgroundColor: "#f2f2f2",
  },
  itemName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
    textAlign: "center",
  },
});
