// Ranking system:
// 1. Bronze 0 - 500 -> 20 points Lose 10
// 2. Silver 500 - 2000 -> 20 points
// 3. Platinum
// 4. Gold
// 5. Ruby
// 6. Diamond
// 7. Antimatter
// 8. Infinite Luck

interface RankTitle {
  title: string;
  color: string;
}

export const rankTitles: {
  [key: number]: RankTitle;
} = {
  0: {
    title: "No Rank",
    color: "hsl(0, 0%, 70%)",
  },
  500: {
    title: "Bronze",
    color: "hsl(30, 50%, 50%)",
  },
  1000: {
    title: "Silver",
    color: "hsl(210, 50%, 75%)",
  },
  2000: {
    title: "Platinum",
    color: "hsl(210, 50%, 90%)",
  },
  4000: {
    title: "Gold",
    color: "hsl(50, 75%, 50%)",
  },
  10000: {
    title: "Ruby",
    color: "hsl(0, 60%, 50%)",
  },
  20000: {
    title: "Diamond",
    color: "hsl(210, 100%, 95%)",
  },
  50000: {
    title: "Antimatter",
    color: "hsl(270, 50%, 50%)",
  },
  100000: {
    title: "Infinite Luck",
    color: "hsl(120, 50%, 50%)",
  },
};

export const challengeOptions = [
  {
    title: "Bo1",
    value: 1,
  },
  {
    title: "Bo3",
    value: 2,
  },
  {
    title: "Bo5",
    value: 3,
  },
];

export enum FINISH_GAME_STATUS {
  "DRAW" = 0,
  "WIN" = 1,
  "LOSE" = -1,
}
