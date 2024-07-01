import { getUserHistoryGames } from "@/app/actions/getUserHistoryGames";
import { FINISH_GAME_STATUS } from "@/lib/constants";
import { cn } from "@/lib/utils";

import { auth } from "@clerk/nextjs/server";
import { format } from "date-fns";

export const UserHistory = async () => {
  const { userId } = auth();
  const games = await getUserHistoryGames();

  const hasGame = !!games.length;

  // win, lose, and draw
  return (
    <div className="border-2 p-2 rounded-md">
      <h3 className="text-lg font-semibold underline underline-offset-2">
        User History:
      </h3>
      <ul className="mt-2 space-y-2">
        {!hasGame && <li>You not have start any challenge</li>}
        {games.map((game) => {
          const otherPlayer =
            game.playerAId === userId ? game.playerA : game.playerB;

          let yourGameStatus: FINISH_GAME_STATUS = FINISH_GAME_STATUS.DRAW;
          if (game.winner === userId) {
            yourGameStatus = FINISH_GAME_STATUS.WIN;
          } else if (game.winner) {
            yourGameStatus = FINISH_GAME_STATUS.LOSE;
          } else if (
            !game.winner &&
            !game.playerAChoice &&
            !game.playerBChoice
          ) {
            yourGameStatus = FINISH_GAME_STATUS.LOSE;
          }

          return (
            <li key={game.id}>
              <div className="flex justify-between">
                <div>
                  <p>
                    Bo1 with{" "}
                    <span className="italic font-medium">
                      {otherPlayer.userName}
                    </span>
                  </p>
                  <p
                    className={cn(
                      "font-semibold text-gray-400",
                      yourGameStatus === FINISH_GAME_STATUS.LOSE &&
                        "text-rose-400",
                      yourGameStatus === FINISH_GAME_STATUS.WIN &&
                        "text-green-500"
                    )}
                  >
                    {yourGameStatus === FINISH_GAME_STATUS.WIN
                      ? "Win"
                      : yourGameStatus === FINISH_GAME_STATUS.LOSE
                      ? "Lose"
                      : "Draw"}
                  </p>
                </div>
                <div>
                  <p>
                    at:{" "}
                    <span className="italic">
                      {format(game.createdAt, "MM/dd/yyyy HH:mm")}
                    </span>
                  </p>
                  <p>
                    end at:{" "}
                    <span className="italic">
                      {format(game.updatedAt, "MM/dd/yyyy HH:mm")}
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
