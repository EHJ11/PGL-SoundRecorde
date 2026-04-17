import type { LoadingSpinnerProps } from "@/types";
import { StyleSheet, Text, View } from "react-native";

const DOT_SIZE = 12;
const DOT_COLOR = "#FF6B6B";

const LoadingSpinner = ({ label }: LoadingSpinnerProps) => (
  <View style={styles.container}>
    <View style={styles.row}>
      <View style={styles.dot} />
      <View style={styles.dot} />
      <View style={styles.dot} />
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
