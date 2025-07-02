import { useRef, useState } from "react";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";

export function useScrollToTop<T>() {
  const scrollRef = useRef<any>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollTop(offsetY > 200);
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollToLocation({
      sectionIndex: 0,
      itemIndex: 0,
      animated: true,
    });
  };

  return {
    scrollRef,
    showScrollTop,
    handleScroll,
    scrollToTop,
  };
}
