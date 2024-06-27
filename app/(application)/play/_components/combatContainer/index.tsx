"use client";

import { MouseEvent, useEffect, useState } from "react";

import { useUser } from "@clerk/nextjs";

import {
  HandMetalIcon,
  OrigamiIcon,
  ScissorsIcon,
  SwordsIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { useGameConfigStore } from "@/store/gameConfig";

import { ReduceCounter } from "./ReduceCounter";
import { sendUserChoice } from "@/socket/socketEvent";

import { LeaderBoardProfile } from "./LeaderBoardProfile";
import { ChoiceOptionBtn } from "./ChoiceOptionBtn";

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

  useEffect(() => {
    const beforeUnLoad = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.stopPropagation();
      e.returnValue = "Hey, Are You sure about It?";
    };
    window.addEventListener("beforeunload", beforeUnLoad);

    return () => {
      window.removeEventListener("beforeunload", beforeUnLoad);
    };
  }, [gameRoom?.gameId]);

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
      <div className="pt-4 space-y-2 w-full">
        <p className="text-center text-xl">Select your choice:</p>
        <div className="rounded-md py-4 px-2 border-2 flex items-center justify-center gap-8">
          <ChoiceOptionBtn
            selectedOption={selectedOption}
            choiceValue={1}
            onClick={handleSelectOption}
            title="Rock"
          >
            <HandMetalIcon size={80} />
          </ChoiceOptionBtn>

          <ChoiceOptionBtn
            selectedOption={selectedOption}
            choiceValue={2}
            onClick={handleSelectOption}
            title="Paper"
          >
            <OrigamiIcon size={80} />
          </ChoiceOptionBtn>

          <ChoiceOptionBtn
            selectedOption={selectedOption}
            choiceValue={3}
            onClick={handleSelectOption}
            title="Scissors"
          >
            <ScissorsIcon size={80} />
          </ChoiceOptionBtn>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-center">
        <Button disabled={submitted || !selectedOption} onClick={handleSubmit}>
          Submit
        </Button>
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
        <div className="flex items-center gap-2 font-bold tracking-wide">
          <p>Round:</p>
          <Skeleton className="w-6 h-6" />
        </div>
      </div>
      <div className="flex items-center gap-8 justify-center">
        <Skeleton className="rounded-full w-20 h-20" />
        <div>
          <SwordsIcon className="w-20 h-20" />
        </div>
        <Skeleton className="rounded-full w-20 h-20" />
      </div>
      <div className="pt-10 w-full">
        <p className="text-center text-2xl">Select your choice:</p>
        <div className="rounded-md py-4 px-2 border-2 flex items-center justify-center gap-8">
          <ChoiceOptionBtn.Skeleton />
          <ChoiceOptionBtn.Skeleton />
          <ChoiceOptionBtn.Skeleton />
        </div>
      </div>
      <div className="mt-2 flex items-center justify-center">
        <Skeleton className="w-20 h-10" />
      </div>
      <div className="mt-2 flex items-center gap-2">
        <p>Time Remaining: </p>
        <div className="font-bold text-xl text-rose-400">
          <Skeleton className="w-10 h-6" />
        </div>
      </div>
    </div>
  );
};
