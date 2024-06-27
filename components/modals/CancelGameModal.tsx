"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useCancelGameModal } from "@/store/useCancelGameModal";
import { DialogDescription } from "@radix-ui/react-dialog";
import { sendCancelCurrentGame } from "@/socket/socketEvent";
import { useGameConfigStore } from "@/store/gameConfig";
import { useRouter } from "next/navigation";

export const CancelGameModal = () => {
  const open = useCancelGameModal((state) => state.open);
  const setOpen = useCancelGameModal((state) => state.setOpen);

  const game = useGameConfigStore((state) => state.gameRoom);

  const router = useRouter();

  const cancelFindChallenge = useGameConfigStore(
    (state) => state.cancelFindChallenge
  );

  const onCancelGame = () => {
    if (game) {
      sendCancelCurrentGame();
      cancelFindChallenge();
    }
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
          {game && (
            <DialogDescription>
              Cancel current game and you will treat as lose this game.
            </DialogDescription>
          )}
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
