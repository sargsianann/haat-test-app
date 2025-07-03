import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";

type Props = {
  onPress: () => void;
  style?: ViewStyle;
  visible: boolean;
};

export default function ScrollToTopButton({ onPress, style, visible }: Props) {
  if (!visible) return null;

  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      <Ionicons name="arrow-up" size={20} color="#fff" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: 32,
    left: 20,
    backgroundColor: "#efa1aa",
    padding: 14,
    borderRadius: 30,
    zIndex: 999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
});
