import { useEffect, useRef } from "react";
import { Animated, StyleSheet, TouchableOpacity } from "react-native";

interface RecordButtonProps {
  isRecording: boolean;
  onPress: () => void;
}

export default function RecordButton({
  isRecording,
  onPress,
}: RecordButtonProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const innerBorderRadius = useRef(new Animated.Value(11)).current;
  const innerSize = useRef(new Animated.Value(22)).current;

  useEffect(() => {
    if (isRecording) {
      Animated.parallel([
        Animated.timing(innerBorderRadius, {
          toValue: 5,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(innerSize, {
          toValue: 20,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      pulseAnim.stopAnimation();
      Animated.parallel([
        Animated.timing(innerBorderRadius, {
          toValue: 11,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(innerSize, {
          toValue: 22,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isRecording]);

  return (
    <Animated.View
      style={[styles.outerRing, { transform: [{ scale: pulseAnim }] }]}
    >
      <TouchableOpacity
        style={[styles.btn, isRecording && styles.btnRecording]}
        onPress={onPress}
        activeOpacity={0.85}
      >
        <Animated.View
          style={[
            styles.inner,
            {
              width: innerSize,
              height: innerSize,
              borderRadius: innerBorderRadius,
            },
          ]}
        />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  outerRing: {},
  btn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#DC2626",
    alignItems: "center",
    justifyContent: "center",
  },
  btnRecording: {
    backgroundColor: "#b91c1c",
  },
  inner: {
    backgroundColor: "#fff",
  },
});
