"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const Livestream = () => {
  const searchParams = useSearchParams();
  const duration = searchParams.get("duration");

  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (typeof duration === "string") {
      const parsedDuration = parseInt(duration, 10);
      if (!isNaN(parsedDuration)) {
        setTimeLeft(parsedDuration * 60); // Convert minutes to seconds
      }
    }
  }, [duration]);

  useEffect(() => {
    if (timeLeft === null) return;

    const intervalId = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft === null) return null;
        if (prevTimeLeft <= 1) {
          clearInterval(intervalId);
          return 0;
        }
        return prevTimeLeft - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  if (timeLeft === null) {
    return <div>Loading...</div>;
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div>
      <h1>Livestream Timer</h1>
      <p>
        Time Left: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </p>
    </div>
  );
};

export default Livestream;
