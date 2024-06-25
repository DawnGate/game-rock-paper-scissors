"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { getRankTitle } from "@/lib/utils";
import { useGameConfigStore } from "@/store/gameConfig";

export const LeaderBoardRank = () => {
  const leaderBoard = useGameConfigStore((state) => state.leaderBoard);

  const rankTitle = getRankTitle(leaderBoard?.point ?? 0);

  if (!leaderBoard) {
    return <LeaderBoardRank.Skeleton />;
  }

  return (
    <div className="text-sm flex items-center gap-2">
      <p>
        Point:{" "}
        <span className="text-gray-700 font-medium">{leaderBoard.point}</span>
      </p>
      <span className="font-bold">-</span>
      <p>
        Rank:{" "}
        <span
          className="font-bold"
          style={{
            color: rankTitle.color,
          }}
        >
          {rankTitle.title}
        </span>
      </p>
      <span className="font-bold">-</span>
      <p>
        Win Streak: <span className="text-green-500">{leaderBoard.streak}</span>
      </p>
    </div>
  );
};

LeaderBoardRank.Skeleton = function LeaderBoardSkeleton() {
  return (
    <div className="flex items-center justify-between gap-2">
      <Skeleton className="w-10 h-6" />
      <Skeleton className="w-6 h-6" />
      <Skeleton className="w-4 h-6" />
    </div>
  );
};
