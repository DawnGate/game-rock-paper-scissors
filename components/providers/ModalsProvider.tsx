"use client";

import { useEffect, useState } from "react";

import { FinishGameModal } from "../modals/FinishGameModal";
import { CancelGameModal } from "../modals/CancelGameModal";

export const ModalsProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <FinishGameModal />
      <CancelGameModal />
    </>
  );
};
