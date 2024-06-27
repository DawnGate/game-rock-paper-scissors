import { create } from "zustand";

interface StoreProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useCancelGameModal = create<StoreProps>((set) => ({
  open: false,
  setOpen: (open) => {
    set({ open });
  },
}));
