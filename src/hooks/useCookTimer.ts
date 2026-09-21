export const useCookTimer = (initialSeconds: number) => {
  return {
    timeLeft: initialSeconds,
    isRunning: false,
    start: () => {},
    pause: () => {},
    stop: () => {},
    formatTime: (sec: number) => "0:00"
  };
};
