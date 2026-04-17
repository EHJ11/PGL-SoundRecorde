import type { LoadingSpinnerProps } from "@/types";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

const DOT_SIZE = 12;
const DOT_COLOR = "#FF6B6B";

function AnimatedDot({ delay }: { delay: number }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, {
          toValue: -8,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(600),
      ]),
    ).start();
  }, []);

  return (
    <Animated.View
      style={[styles.dot, { transform: [{ translateY: anim }] }]}
    />
  );
}

const LoadingSpinner = ({ label }: LoadingSpinnerProps) => (
  <View style={styles.container}>
    <View style={styles.row}>
      <AnimatedDot delay={0} />
      <AnimatedDot delay={150} />
      <AnimatedDot delay={300} />
    </View>
    {label ? <Text style={styles.label}>{label}</Text> : null}
  </View>
);

export default LoadingSpinner;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
  },
  row: { flexDirection: "row", alignItems: "center" },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: DOT_COLOR,
    marginHorizontal: 4,
  },
  label: {
    marginTop: 14,
    fontSize: 13,
    color: "#999",
    letterSpacing: 0.5,
    fontStyle: "italic",
  },
});
