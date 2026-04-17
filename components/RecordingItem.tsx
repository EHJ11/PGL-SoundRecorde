import { formatDuration } from "@/hooks/useAudioRecorder";
import type { RecordingItemProps } from "@/types";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const RecordingItem = ({
  recording,
  isPlaying,
  playbackPosition,
  onPlay,
  onDelete,
}: RecordingItemProps) => {
  const date = new Date(recording.createdAt);
  const dateStr = date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  const actionIcon = isPlaying
    ? require("../assets/images/pause.png")
    : require("../assets/images/start.png");

  const displayedDuration = isPlaying
    ? formatDuration(playbackPosition ?? 0)
    : formatDuration(recording.duration);

  return (
    <View style={[styles.container, isPlaying && styles.containerPlaying]}>
      {isPlaying && <View style={styles.playingIndicator} />}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {recording.name}
        </Text>
        <Text style={styles.meta}>
          {dateStr} · {displayedDuration}
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.actionBtn, isPlaying && styles.actionBtnActive]}
        onPress={onPlay}
        activeOpacity={0.7}
      >
        <Image
          source={actionIcon}
          style={styles.actionBtnIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={onDelete}
        activeOpacity={0.7}
      >
        <Text style={styles.deleteBtnText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RecordingItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E2E",
    borderRadius: 14,
    marginBottom: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#2E2E3E",
    overflow: "hidden",
  },
  containerPlaying: {
    borderColor: "#FF6B6B",
    backgroundColor: "#251A1A",
  },
  playingIndicator: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: "#FF6B6B",
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    color: "#EFEFEF",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 3,
  },
  meta: {
    color: "#888",
    fontSize: 12,
    letterSpacing: 0.3,
  },
  actionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#2A2A3E",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  actionBtnActive: {
    backgroundColor: "#FF6B6B22",
  },
  actionBtnIcon: {
    width: 20,
    height: 20,
  },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#2A1A1A",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteBtnText: {
    color: "#FF4444",
    fontSize: 13,
    fontWeight: "700",
  },
});
