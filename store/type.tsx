import { LeaderBoard } from "@prisma/client";

export type GameRoom = {
  gameId: string;
  gameRoomId: string;
  playerIds: [string, string];
  players: [LeaderBoard, LeaderBoard];
};

export type GameStatus = "idle" | "waiting" | "found";
