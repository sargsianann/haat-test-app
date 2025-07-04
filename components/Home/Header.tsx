import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import LanguageSwitcher from "../ui/LanguageSwitcher";

type Props = {
  animatedStyle: any;
  textStyle: any;
  title: string;
  height: number;
};

export default function Header({
  animatedStyle,
  textStyle,
  title,
  height,
}: Props) {
  return (
    <Animated.View style={[styles.header, { height }, animatedStyle]}>
      <Animated.Text style={[styles.headerText, textStyle]}>
        {title}
      </Animated.Text>
      <LanguageSwitcher />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    zIndex: 100,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerText: {
    top: 25,
    fontSize: 20,
    fontWeight: "bold",
  },
});
