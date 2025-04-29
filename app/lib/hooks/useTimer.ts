import { useEffect, useState } from "react";

export default function useTimer(timer = 120) {
  const [startTimer, setStartTimer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timer);

  useEffect(() => {
    if (!startTimer) return;
    if (timeLeft <= 0) {
      setStartTimer(false);
      setTimeLeft(120);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, startTimer]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const secondsEdit =
    seconds === 0 ? "00" : seconds < 10 ? `0${seconds}` : seconds;

  return {
    startTimer,
    setStartTimer,
    timeLeft,
    setTimeLeft,
    minutes,
    seconds: secondsEdit,
    timer: `${minutes}:${secondsEdit}`,
  };
}
