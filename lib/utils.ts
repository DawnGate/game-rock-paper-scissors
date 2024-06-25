import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { rankTitles } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getRankTitle = (point: number) => {
  const rankPointMarks = Object.keys(rankTitles)
    .map((item) => Number(item))
    .sort((a, b) => a - b);

  for (let i = 0; i < rankPointMarks.length; i++) {
    if (rankPointMarks[i] > point) {
      return rankTitles[rankPointMarks[i - 1]];
    }
  }

  return rankTitles[rankPointMarks[rankPointMarks.length - 1]];
};
