"use client";

import { Button } from "@/components/ui/button";
import { useCancelGameModal } from "@/store/useCancelGameModal";
import { ArrowLeftIcon } from "lucide-react";

export const ReturnAppNav = () => {
  const setOpen = useCancelGameModal((state) => state.setOpen);

  const handleBack = () => {
    setOpen(true);
  };

  return (
    <Button variant="ghost" onClick={handleBack}>
      <ArrowLeftIcon />
      Back to Home / Exit Combat
    </Button>
  );
};
