import { create } from "zustand";
import { GameRoom, GameStatus } from "./type";
import { LeaderBoard } from "@prisma/client";

interface GameConfigState {
  leaderBoard: LeaderBoard | null;
  status: GameStatus;
  isSocketReady: boolean;
  gameRoom: GameRoom | null;
  startFindChallenge: () => void;
  cancelFindChallenge: () => void;
  foundChallenge: (gameRoom: GameRoom) => void;
  updateSocketStatus: (isReady: boolean) => void;
  initLeaderBoard: (leaderBoard: LeaderBoard) => void;
  updateLeaderBoard: ({streak, point}:{ streak: number, point: number }) => void;
}

export const useGameConfigStore = create<GameConfigState>((set, get) => ({
  leaderBoard: null,
  status: "idle",
  isSocketReady: false,
  gameRoom: null,
  startFindChallenge: () => {
    set({ status: "waiting" });
  },
  cancelFindChallenge: () => {
    set({ status: "idle", gameRoom: null });
  },
  foundChallenge: (gameRoom) => {
    set({ status: "found", gameRoom });
  },
  updateSocketStatus: (isReady) => {
    set({ isSocketReady: isReady });
  },
  initLeaderBoard: (newLeaderBoard) => {
    set({ leaderBoard: newLeaderBoard });
  },
  updateLeaderBoard: ({ streak, point }) => {
    const currentLeaderBoard = get().leaderBoard;

    if (!currentLeaderBoard) return;

    set({
      leaderBoard: { ...currentLeaderBoard, point, streak },
    });
  },
}));
