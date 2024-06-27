import { FINISH_GAME_STATUS } from "@/lib/constants";
import { create } from "zustand";

type FinishData = {
  gamePoints: number;
  finishGameStatus: FINISH_GAME_STATUS;
  isTimeout?: boolean;
};

interface StoreProps {
  open: boolean;
  finishData: FinishData | null;
  setOpen: (open: boolean, finishData?: FinishData) => void;
}

export const useFinishGameModal = create<StoreProps>((set) => ({
  open: false,
  finishData: null,
  setOpen: (open, finishData) => {
    if (!open) {
      set({ open: false, finishData: null });
    } else {
      set({ open, finishData });
    }
  },
}));
