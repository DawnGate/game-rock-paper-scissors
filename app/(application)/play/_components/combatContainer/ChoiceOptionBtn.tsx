import { ReactNode, MouseEvent } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  selectedOption: number | null;
  choiceValue: number;
  children: ReactNode;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  title: string;
}

export const ChoiceOptionBtn = ({
  selectedOption,
  choiceValue,
  children,
  onClick,
  title,
}: Props) => {
  return (
    <div>
      <Button
        size="icon"
        variant="ghost"
        className={`p-4 rounded-full w-auto h-auto ${
          selectedOption === choiceValue && "bg-rose-500 hover:bg-rose-500"
        }`}
        value={choiceValue}
        onClick={onClick}
      >
        {children}
      </Button>
      <p className="text-center mt-2 font-medium">{title}</p>
    </div>
  );
};

ChoiceOptionBtn.Skeleton = function ChoiceOptionBtnSkeleton() {
  return (
    <Button variant="ghost" className="p-4 h-auto rounded-full">
      <Skeleton className="block w-20 h-20 rounded-full" />
    </Button>
  );
};
