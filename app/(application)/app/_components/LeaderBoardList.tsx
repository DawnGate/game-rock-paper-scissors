import { getListLeaderBoard } from "@/app/actions/getListLeaderBoard";
import { getRankTitle } from "@/lib/utils";

import Image from "next/image";

export const LeaderBoardList = async () => {
  const leaderBoards = await getListLeaderBoard();
  return (
    <div className="rounded-md border-2 h-full p-2">
      <h1 className="uppercase text-lg font-bold text-center">Leader board</h1>
      <ul className="space-y-2">
        {leaderBoards.map((leaderBoard, index) => {
          const rankTitle = getRankTitle(leaderBoard.point);

          return (
            <li key={leaderBoard.userId}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 w-3/4 pr-2">
                  <p className="text-lg font-bold">{index + 1}</p>
                  <Image
                    className="w-10 h-10"
                    alt="Avatar"
                    src={leaderBoard.imageUrl}
                    width={40}
                    height={40}
                  />
                  <p className="truncate">{leaderBoard.userName}</p>
                </div>
                <div className="shrink-0 w-1/4">
                  <p className="text-sm truncate">
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
                  <p className="text-sm truncate">
                    Point:{" "}
                    <span className="font-semibold text-slate-500">
                      {leaderBoard.point}
                    </span>
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
