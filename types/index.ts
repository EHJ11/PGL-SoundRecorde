export type Recording = {
  id: string;
  name: string;
  uri: string;
  duration: number;
  createdAt: number;
};

export type RecordingItemProps = {
  recording: Recording;
  isPlaying: boolean;
  onPlay: () => void;
  onDelete: () => void;
};

export type LoadingSpinnerProps = {
  label?: string;
};
