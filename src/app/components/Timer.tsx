// src/components/Timer.tsx
"use client";
import { useState, useEffect } from "react";

interface TimerProps {
  initialTime: number;
}

const Timer: React.FC<TimerProps> = ({ initialTime }) => {
  const [time, setTime] = useState<number>(initialTime);
  const [isActive, setIsActive] = useState<boolean>(true);

  useEffect(() => {
    setTime(initialTime); // Reset the time when initialTime changes
    setIsActive(true); // Start the timer when initialTime changes
  }, [initialTime]);

  useEffect(() => {
    let interval: number | undefined;
    if (isActive && time > 0) {
      interval = window.setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
    } else if (!isActive && time !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div>
      <h1>Timer: {formatTime(time)}</h1>
      <button onClick={() => setIsActive(true)}>Start</button>
      <button onClick={() => setIsActive(false)}>Pause</button>
      <button onClick={() => setTime(initialTime)}>Reset</button>
    </div>
  );
};

export default Timer;
