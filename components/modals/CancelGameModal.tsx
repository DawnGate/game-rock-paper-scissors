"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useCancelGameModal } from "@/store/useCancelGameModal";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { sendCancelCurrentGame } from "@/socket/socketEvent";
import { useGameConfigStore } from "@/store/gameConfig";
import { useRouter } from "next/navigation";

export const CancelGameModal = () => {
  const open = useCancelGameModal((state) => state.open);
  const setOpen = useCancelGameModal((state) => state.setOpen);

  const router = useRouter();

  const cancelFindChallenge = useGameConfigStore(
    (state) => state.cancelFindChallenge
  );

  const onCancelGame = () => {
    sendCancelCurrentGame();
    cancelFindChallenge();
    setOpen(false);
    router.push("/app");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(false);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel Game</DialogTitle>
          <DialogDescription>
            Cancel current game and you will treat as lose this game.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 mx-auto">
          <Button variant="destructive" onClick={onCancelGame}>
            Exit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
