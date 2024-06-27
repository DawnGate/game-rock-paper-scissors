"use client";
import { useEffect, useState } from "react";

export const ReduceCounter = () => {
  const [remainSecond, setRemainSecond] = useState(
    Number(process.env.NEXT_PUBLIC_GAME_SECONDS)
  );

  useEffect(() => {
    let timeOut = null;
    if (remainSecond) {
      timeOut = setTimeout(() => {
        setRemainSecond((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (timeOut) {
        clearTimeout(timeOut);
      }
    };
  }, [remainSecond]);

  const minutes = Math.floor(remainSecond / 60);

  const seconds = remainSecond - minutes * 60;

  return (
    <>
      <span>{String(minutes).padStart(2, "0")}</span>
      <span>:</span>
      <span>{String(seconds).padStart(2, "0")}</span>
    </>
  );
};
