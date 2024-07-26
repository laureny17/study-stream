"use client";

import { FC, useState } from "react";
import Link from "next/link";
import Slider from "./components/Slider";

const HomePage: FC = () => {
  const [duration, setDuration] = useState<number>(0);

  const handleSliderChange = (value: number) => {
    setDuration(value);
  };

  return (
    <main className="homepage">
      <h1>Welcome to the Study Stream App!</h1>
      <section className="slider-section">
        <Slider onChange={handleSliderChange} />
        <p>Selected Duration: {duration} minutes</p>
        <Link href={`/livestream?duration=${duration}`}>
          <button>Start Livestream</button>
        </Link>
      </section>
    </main>
  );
};

export default HomePage;
