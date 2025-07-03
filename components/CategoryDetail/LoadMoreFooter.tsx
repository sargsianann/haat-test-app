import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

type Props = {
  loadingMore: boolean;
  loadingText: string;
};

export default function LoadMoreFooter({ loadingMore, loadingText }: Props) {
  if (!loadingMore) {
    return (
      <View style={styles.loadMoreFooter}>
        <Text style={styles.loadMoreText}>{loadingText}</Text>
      </View>
    );
  }

  return (
    <View style={styles.loadMoreFooter}>
      <ActivityIndicator size="small" color="#007AFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  loadMoreFooter: {
    paddingVertical: 16,
    alignItems: "center",
  },
  loadMoreText: {
    color: "#007AFF",
    fontWeight: "500",
  },
});
