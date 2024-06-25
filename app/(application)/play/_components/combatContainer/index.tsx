"use client";

import { MouseEvent, useState } from "react";

import { useUser } from "@clerk/nextjs";

import {
  HandMetalIcon,
  OrigamiIcon,
  ScissorsIcon,
  SwordsIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { useGameConfigStore } from "@/store/gameConfig";

import { ReduceCounter } from "./ReduceCounter";
import { sendUserChoice } from "@/socket/socketEvent";

import { LeaderBoardProfile } from "./LeaderBoardProfile";
import { Skeleton } from "@/components/ui/skeleton";

export const CombatContainer = () => {
  const { user, isLoaded } = useUser();

  const gameRoom = useGameConfigStore((state) => state.gameRoom);

  const userIndex = gameRoom?.playerIds.indexOf(user?.id ?? "") ?? 0;

  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const [submitted, setSubmitted] = useState(false);

  const handleSelectOption = (e: MouseEvent<HTMLButtonElement>) => {
    const newOption = Number(e.currentTarget.value);

    if (!submitted) {
      setSelectedOption(newOption);
    }
  };

  const handleSubmit = () => {
    if (submitted || !gameRoom || !selectedOption) return;

    sendUserChoice({
      gameId: gameRoom.gameId,
      choice: selectedOption,
    });

    setSubmitted(true);
  };

  if (!isLoaded || !user || !gameRoom) {
    return <CombatContainer.Skeleton />;
  }

  return (
    <div className="flex flex-col items-center space-y-4 my-4">
      <div className="border-2 p-2 px-4 rounded-xl">
        <p className="font-bold tracking-wide">Round 0/1</p>
      </div>
      <div className="flex items-center gap-8 justify-center">
        <LeaderBoardProfile leaderBoard={gameRoom.players[userIndex]} />
        <div>
          <SwordsIcon className="w-20 h-20" />
        </div>
        <LeaderBoardProfile
          leaderBoard={gameRoom.players[(userIndex + 1) % 2]}
        />
      </div>
      <div className="pt-10 w-full">
        <div className="rounded-md py-4 px-2 border-2 flex items-center justify-center gap-8">
          <Button
            size="icon"
            variant="ghost"
            className={`p-4 rounded-full w-auto h-auto ${
              selectedOption === 1 && "bg-rose-500 hover:bg-rose-500"
            }`}
            value={1}
            onClick={handleSelectOption}
          >
            <HandMetalIcon size={80} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className={`p-4 rounded-full w-auto h-auto ${
              selectedOption === 2 && "bg-rose-500 hover:bg-rose-500"
            }`}
            value={2}
            onClick={handleSelectOption}
          >
            <OrigamiIcon size={80} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className={`p-4 rounded-full w-auto h-auto ${
              selectedOption === 3 && "bg-rose-500 hover:bg-rose-500"
            }`}
            value={3}
            onClick={handleSelectOption}
          >
            <ScissorsIcon size={80} />
          </Button>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-center">
        {selectedOption ? (
          <Button disabled={submitted} onClick={handleSubmit}>
            Submit
          </Button>
        ) : null}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <p>Time Remaining: </p>
        <p className="font-bold text-xl text-rose-400">
          <ReduceCounter />
        </p>
      </div>
    </div>
  );
};

CombatContainer.Skeleton = function CombatContainerSkeleton() {
  return (
    <div className="flex flex-col items-center space-y-4 my-4">
      <div className="border-2 p-2 px-4 rounded-xl">
        <p className="font-bold tracking-wide">
          Round <Skeleton className="w-6 h-6" />
        </p>
      </div>
      <div className="flex items-center gap-8 justify-center">
        <Skeleton className="rounded-full w-20 h-20" />
        <div>
          <SwordsIcon className="w-20 h-20" />
        </div>
        <Skeleton className="rounded-full w-20 h-20" />
      </div>
      <div className="pt-10 w-full">
        <div className="rounded-md py-4 px-2 border-2 flex items-center justify-center gap-8">
          <Button size="icon" variant="ghost" value={1}>
            <HandMetalIcon size={80} />
          </Button>
          <Button size="icon" variant="ghost" value={2}>
            <OrigamiIcon size={80} />
          </Button>
          <Button size="icon" variant="ghost" value={3}>
            <ScissorsIcon size={80} />
          </Button>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-center">
        <Skeleton className="w-10 h-6" />
      </div>
      <div className="mt-2 flex items-center gap-2">
        <p>Time Remaining: </p>
        <p className="font-bold text-xl text-rose-400">
          <Skeleton className="w-10 h-6" />
        </p>
      </div>
    </div>
  );
};
