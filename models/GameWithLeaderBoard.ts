import { Game, LeaderBoard } from "@prisma/client";

export type GameWithLeaderBoard = Game & {
  playerA: LeaderBoard;
  playerB: LeaderBoard;
};
