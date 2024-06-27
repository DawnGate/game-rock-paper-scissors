import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { FINISH_GAME_STATUS } from "@/lib/constants";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useGameConfigStore } from "@/store/gameConfig";
import { useFinishGameModal } from "@/store/useFinishGameModal";

import { cn } from "@/lib/utils";

export const FinishGameModal = () => {
  const router = useRouter();
  const open = useFinishGameModal((state) => state.open);
  const finishData = useFinishGameModal((state) => state.finishData);
  const setOpen = useFinishGameModal((state) => state.setOpen);

  const cancelFindChallenge = useGameConfigStore(
    (state) => state.cancelFindChallenge
  );

  const isTimeout = finishData?.isTimeout;

  let yourStatus;
  let timeoutContent = null;

  if (finishData?.finishGameStatus === FINISH_GAME_STATUS.DRAW) {
    yourStatus = "Draw";
  } else if (finishData?.finishGameStatus === FINISH_GAME_STATUS.LOSE) {
    yourStatus = "You Lose";
    timeoutContent = "TIMEOUT!!! Ran out of time.";
  } else if (finishData?.finishGameStatus === FINISH_GAME_STATUS.WIN) {
    yourStatus = "You Win";
    timeoutContent = "TIMEOUT!!! Your component is give up.";
  }

  const handleClose = () => {
    cancelFindChallenge();
    router.push("/app");
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        handleClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Game Finish</DialogTitle>
        </DialogHeader>

        {isTimeout && <DialogDescription>{timeoutContent}</DialogDescription>}

        <div className="my-4 text-center space-y-2">
          <div className="font-bold text-3xl">{yourStatus}</div>
          {finishData &&
            finishData.finishGameStatus !== FINISH_GAME_STATUS.DRAW && (
              <div
                className={cn(
                  "font-semibold",
                  finishData.finishGameStatus === FINISH_GAME_STATUS.WIN
                    ? "text-green-500"
                    : "text-rose-500"
                )}
              >
                {finishData.gamePoints * finishData.finishGameStatus}
                &nbsp;Points
              </div>
            )}
        </div>

        <div className="flex justify-center">
          <DialogClose asChild>
            <Button>Close / Back to Homepage</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};
