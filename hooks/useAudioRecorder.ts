import {
  createAudioPlayer,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { useEffect, useRef, useState } from "react";

import {
  clearRecordings,
  loadRecordings,
  saveRecordings,
} from "@/services/storage";
import type { Recording } from "@/types";

type UseAudioRecorderReturn = {
  recordings: Recording[];
  isLoadingRecordings: boolean;
  isRecording: boolean;
  recordingDuration: number;
  playingId: string | null;
  playbackPosition: number;
  startRecording: () => Promise<boolean>;
  stopRecording: () => Promise<void>;
  playRecording: (recording: Recording) => void;
  removeRecording: (id: string) => void;
  removeAllRecordings: () => void;
};

export function formatDuration(value: number): string {
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  const paddedSeconds = seconds.toString().padStart(2, "0");
  return `${minutes}:${paddedSeconds}`;
}

export default function useAudioRecorderHook(): UseAudioRecorderReturn {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [isLoadingRecordings, setIsLoadingRecordings] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const playbackTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isRecording = recorderState?.isRecording ?? false;
  const recordingDuration = Math.round(
    (recorderState?.durationMillis ?? 0) / 1000,
  );
  const audioPlayerRef = useRef<ReturnType<typeof createAudioPlayer> | null>(
    null,
  );

  useEffect(() => {
    let active = true;

    const loadSavedRecordings = async () => {
      try {
        const saved = await loadRecordings();
        if (active) {
          setRecordings(saved);
        }
      } catch (error) {
        console.error("Error loading saved recordings:", error);
      } finally {
        if (active) {
          setIsLoadingRecordings(false);
        }
      }
    };

    void loadSavedRecordings();

    return () => {
      active = false;
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current);
        playbackTimerRef.current = null;
      }
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.remove();
        audioPlayerRef.current = null;
      }
    };
  }, []);

  const clearPlaybackTimer = (): void => {
    if (playbackTimerRef.current) {
      clearInterval(playbackTimerRef.current);
      playbackTimerRef.current = null;
    }
  };

  const stopCurrentPlayer = (): void => {
    clearPlaybackTimer();

    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.remove();
      audioPlayerRef.current = null;
    }

    setPlaybackPosition(0);
  };

  const startRecording = async (): Promise<boolean> => {
    const permission = await requestRecordingPermissionsAsync();
    if (!permission.granted && permission.status !== "granted") {
      return false;
    }

    try {
      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });
      await recorder.prepareToRecordAsync();
      const status = recorder.getStatus();
      if (!status.canRecord) {
        console.error("Recorder cannot record:", status);
        return false;
      }
      recorder.record();
      return true;
    } catch (error) {
      console.error("Error starting recording:", error);
      return false;
    }
  };

  const stopRecording = async (): Promise<void> => {
    const status = recorder.getStatus();
    if (!status.isRecording) {
      return;
    }

    try {
      await recorder.stop();
      const uri = recorder.uri;
      const duration = Math.max(0, Math.round(status.durationMillis / 1000));
      if (!uri) {
        return;
      }

      const newRecording: Recording = {
        id: `${Date.now()}`,
        name: `Grabación ${recordings.length + 1}`,
        uri,
        duration,
        createdAt: Date.now(),
      };

      const nextRecordings = [newRecording, ...recordings];
      setRecordings(nextRecordings);
      await saveRecordings(nextRecordings);
      await setAudioModeAsync({ allowsRecording: false });
    } catch (error) {
      console.error("Error stopping recording:", error);
    }
  };

  const playRecording = (recording: Recording): void => {
    if (playingId === recording.id) {
      stopCurrentPlayer();
      setPlayingId(null);
      return;
    }

    stopCurrentPlayer();

    try {
      const player = createAudioPlayer(recording.uri, { updateInterval: 500 });
      audioPlayerRef.current = player;
      player.play();
      setPlayingId(recording.id);
      setPlaybackPosition(0);

      playbackTimerRef.current = setInterval(() => {
        setPlaybackPosition((prev) => {
          const next = prev + 1;
          if (next >= recording.duration) {
            clearPlaybackTimer();
            if (audioPlayerRef.current) {
              audioPlayerRef.current.pause();
              audioPlayerRef.current.remove();
              audioPlayerRef.current = null;
            }
            setPlayingId(null);
            return recording.duration;
          }
          return next;
        });
      }, 1000);
    } catch (error) {
      console.error("Error playing recording:", error);
    }
  };

  const removeRecording = async (id: string): Promise<void> => {
    const nextRecordings = recordings.filter(
      (recording) => recording.id !== id,
    );
    setRecordings(nextRecordings);
    if (playingId === id) {
      stopCurrentPlayer();
      setPlayingId(null);
    }
    await saveRecordings(nextRecordings);
  };

  const removeAllRecordings = async (): Promise<void> => {
    stopCurrentPlayer();
    setRecordings([]);
    setPlayingId(null);
    await clearRecordings();
  };

  return {
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
  };
}
