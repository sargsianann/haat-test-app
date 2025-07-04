import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

type Props = {
  loading: boolean;
};

export default function LoadMoreFooter({ loading }: Props) {
  const { t } = useTranslation();

  return (
    <View style={styles.footer}>
      {loading ? (
        <ActivityIndicator size="small" color="#007AFF" />
      ) : (
        <Text style={styles.text}>{t("loadingMore")}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingVertical: 16,
    alignItems: "center",
  },
  text: {
    color: "#007AFF",
    fontWeight: "500",
  },
});
