"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { challengeOptions } from "@/lib/constants";
import { useGameConfigStore } from "@/store/gameConfig";

export const OptionGroup = () => {
  const [selectedOption, setSelectedOption] = useState(challengeOptions[0].value);
  const status = useGameConfigStore((state) => state.status);

  const changeOption = (option: number) => {
    setSelectedOption(option);
  };

  return (
    <div className="flex items-center gap-2 justify-center">
      {challengeOptions.map((option) => {
        const isWaiting = status === "waiting";
        const onClick = () => {
          if (!isWaiting) {
            changeOption(option.value);
          }
        };

        return (
          <Button
            className={`w-20 opacity-50 ${!isWaiting && "opacity-100"}`}
            variant={option.value === selectedOption ? "default" : "outline"}
            key={option.title}
            onClick={onClick}
          >
            {option.title}
          </Button>
        );
      })}
    </div>
  );
};
