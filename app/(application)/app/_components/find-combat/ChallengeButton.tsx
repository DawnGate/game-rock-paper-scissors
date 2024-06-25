"use client";

import { Button } from "@/components/ui/button";
import { sendFindGame, sendCancelFindGame } from "@/socket/socketEvent";

import { useGameConfigStore } from "@/store/gameConfig";
import { useAuth } from "@clerk/nextjs";

export const ChallengeButton = () => {
  const { userId } = useAuth();

  const status = useGameConfigStore((state) => state.status);
  const isSocketReady = useGameConfigStore((state) => state.isSocketReady);
  const leaderBoardUser = useGameConfigStore((state) => state.leaderBoard);
  const gameConfig = useGameConfigStore();

  const handleFindNewGame = () => {
    gameConfig.startFindChallenge();
    if (userId) {
      sendFindGame({ userId });
    }
  };

  const handleCancelFindGame = () => {
    gameConfig.cancelFindChallenge();
    sendCancelFindGame();
  };

  let content = (
    <Button
      disabled={!isSocketReady || !leaderBoardUser}
      onClick={handleFindNewGame}
    >
      Find Challenge
    </Button>
  );

  if (status === "waiting") {
    content = (
      <div className="flex items-center gap-2">
        <p>Waiting Challenger....</p>
        <Button variant="outline" onClick={handleCancelFindGame}>
          X
        </Button>
      </div>
    );
  } else if (status === "found") {
    content = <Button>Found Game. Waiting for both players ready.</Button>;
  }

  return <div className="flex items-center justify-center">{content}</div>;
};
