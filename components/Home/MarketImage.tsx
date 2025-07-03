import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

type Props = {
  uri: string;
  top: number;
  animatedStyle: any;
};

export default function MarketImage({ uri, top, animatedStyle }: Props) {
  return (
    <Animated.Image
      source={{ uri }}
      style={[
        styles.image,
        { top, position: "absolute", zIndex: 50 },
        animatedStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 160,
    resizeMode: "cover",
  },
});
