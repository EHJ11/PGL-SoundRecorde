import { type FC } from "react";
import { StyleSheet, View } from "react-native";

interface WaveAnimationProps {
  active: boolean;
}

const WaveAnimation: FC<WaveAnimationProps> = ({ active }) => (
  <View style={styles.container}>
    <View style={[styles.bar, active ? styles.barLarge : styles.barSmall]} />
    <View style={[styles.bar, active ? styles.barMedium : styles.barSmall]} />
    <View style={[styles.bar, active ? styles.barLarge : styles.barSmall]} />
  </View>
);

export default WaveAnimation;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 34,
  },
  bar: {
    width: 12,
    borderRadius: 6,
    backgroundColor: "#FF6B6B",
  },
  barSmall: {
    height: 30,
  },
  barMedium: {
    height: 45,
  },
  barLarge: {
    height: 60,
  },
});
