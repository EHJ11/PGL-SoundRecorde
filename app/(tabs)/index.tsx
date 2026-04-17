import LoadingSpinner from "@/components/LoadingSpinner";
import RecordButton from "@/components/RecordButton";
import RecordingItem from "@/components/RecordingItem";
import useAudioRecorderHook, { formatDuration } from "@/hooks/useAudioRecorder";
import type { Recording } from "@/types";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const {
    recordings,
    isLoadingRecordings,
    isRecording,
    recordingDuration,
    playingId,
    playbackPosition,
    startRecording,
    stopRecording,
    playRecording,
    removeRecording,
    removeAllRecordings,
  } = useAudioRecorderHook();

  const handleRecordToggle = async (): Promise<void> => {
    if (isRecording) {
      await stopRecording();
    } else {
      const started = await startRecording();
      if (!started) {
        Alert.alert(
          "Permiso denegado",
          "La app necesita acceso al micrófono. Actívalo en los ajustes del dispositivo.",
          [{ text: "Entendido" }],
        );
      }
    }
  };

  const handleDeleteAll = (): void => {
    if (recordings.length === 0) return;
    Alert.alert("Eliminar todo", "¿Borrar todas las grabaciones?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar todo",
        style: "destructive",
        onPress: () => {
          void removeAllRecordings();
        },
      },
    ]);
  };

  const handleDeleteOne = (id: string, name: string): void => {
    Alert.alert("Eliminar grabación", `¿Eliminar "${name}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          void removeRecording(id);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D1A" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}> SoundRecorder</Text>
          <Text style={styles.headerSub}>
            {recordings.length} grabación{recordings.length !== 1 ? "es" : ""}
          </Text>
        </View>

        <View style={styles.recordZone}>
          <Text
            style={[styles.timerText, isRecording && styles.timerTextActive]}
          >
            {formatDuration(recordingDuration)}
          </Text>

          {isRecording && <LoadingSpinner label="Grabando..." />}

          <RecordButton
            isRecording={isRecording}
            onPress={() => {
              void handleRecordToggle();
            }}
          />

          <Text style={styles.recordHint}>
            {isRecording ? "Toca para parar" : "Toca para grabar"}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Grabaciones</Text>
          {recordings.length > 0 && (
            <TouchableOpacity
              onPress={handleDeleteAll}
              style={styles.deleteAllBtn}
            >
              <Text style={styles.deleteAllText}>Borrar todo</Text>
            </TouchableOpacity>
          )}
        </View>

        {isLoadingRecordings ? (
          <LoadingSpinner label="Cargando grabaciones..." />
        ) : recordings.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Aún no hay grabaciones</Text>
            <Text style={styles.emptyHint}>Pulsa el botón para empezar</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
            {recordings.map((rec: Recording) => (
              <RecordingItem
                key={rec.id}
                recording={rec}
                isPlaying={playingId === rec.id}
                playbackPosition={playingId === rec.id ? playbackPosition : 0}
                onPlay={() => {
                  playRecording(rec);
                }}
                onDelete={() => {
                  handleDeleteOne(rec.id, rec.name);
                }}
              />
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0D0D1A" },
  container: { flex: 1, paddingHorizontal: 20 },
  header: {
    paddingTop: 20,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "#EFEFEF",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  headerSub: { color: "#666", fontSize: 13 },
  recordZone: { alignItems: "center", paddingVertical: 24 },
  timerText: {
    fontSize: 40,
    fontWeight: "200",
    color: "#444",
    letterSpacing: 4,
    marginBottom: 8,
  },
  timerTextActive: { color: "#FF6B6B" },
  recordHint: { color: "#555", fontSize: 13, letterSpacing: 0.5 },
  divider: {
    height: 1,
    backgroundColor: "#252532",
    marginVertical: 8,
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  listTitle: { color: "#EFEFEF", fontSize: 16, fontWeight: "700" },
  deleteAllBtn: { paddingVertical: 8, paddingHorizontal: 12 },
  deleteAllText: { color: "#FF6B6B", fontSize: 13, fontWeight: "600" },
  list: { flex: 1 },
  listContent: { paddingBottom: 20 },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  emptyText: {
    color: "#EFEFEF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  emptyHint: {
    color: "#888",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
  },
});
