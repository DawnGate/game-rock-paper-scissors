import { LeaderBoard } from "@prisma/client";

import { getRankTitle } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Props {
  leaderBoard: LeaderBoard;
}

export const LeaderBoardProfile = ({ leaderBoard }: Props) => {
  const rankTitle = getRankTitle(leaderBoard.point);

  return (
    <div className="space-y-2">
      <Avatar className="w-20 h-20 mx-auto">
        <AvatarImage src={leaderBoard.imageUrl} />
        <AvatarFallback>{leaderBoard.userName}</AvatarFallback>
      </Avatar>
      <div className="text-center">
        <p className="font-bold text-rose-600">{leaderBoard.userName}</p>
        <p>
          <span
            className="font-semibold text-slate-400"
            style={{
              color: rankTitle.color,
            }}
          >
            {rankTitle.title}
          </span>
          <span className="inline-block px-2">-</span>
          <span className="font-semibold text-black">{leaderBoard.point}</span>
        </p>
      </div>
    </div>
  );
};
