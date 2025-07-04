import { StyleSheet, Text, View } from "react-native";
import ProductCard from "./ProductCard";

type Props = {
  title: string;
  data: any[][];
  language: string;
  onLayout?: (y: number) => void;
};

export default function ProductGridSection({
  title,
  data,
  language,
  onLayout,
}: Props) {
  return (
    <View onLayout={(e) => onLayout?.(e.nativeEvent.layout.y)}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </View>

      {data.map((row, i) => (
        <View key={i} style={styles.row}>
          {row.map((product, j) => (
            <ProductCard key={j} product={product} language={language} />
          ))}
          {row.length === 1 && (
            <View style={{ flex: 1, marginHorizontal: 4 }} />
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
});
