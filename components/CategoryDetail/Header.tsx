import { BlurView } from "expo-blur";
import { StyleSheet, Text } from "react-native";

type Props = {
  title: string;
  paddingTop: number;
  height: number;
};

export default function Header({ title, paddingTop, height }: Props) {
  return (
    <BlurView
      testID="header-blur"
      intensity={50}
      tint="light"
      style={[styles.header, { paddingTop, height }]}
    >
      <Text style={styles.headerTitle}>{title}</Text>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ddd",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
});
