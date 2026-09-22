export interface RecipeStep {
  text: string;
  timer?: number; // duration in seconds
  timerLabel?: string;
  prep?: string;
}

export type RecipeInput = (RecipeStep | string)[] | string;

export interface RunningTimer {
  stepIndex: number;
  durationSeconds: number;
  remainingSeconds: number;
  startTime: number;
  isPaused: boolean;
  endTime?: number;
}
