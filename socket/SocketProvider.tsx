"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

import { useGameConfigStore } from "@/store/gameConfig";

import { socket } from "@/socket";
import { GameRoom } from "@/store/type";
import { findOrCreateLBById } from "@/app/actions/findOrCreateLBById";
import { useFinishGameModal } from "@/store/useFinishGameModal";

import { FINISH_GAME_STATUS, SOCKET_EVENTS } from "@/lib/constants";
import { toast } from "sonner";

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { userId } = useAuth();

  const cancelFindChallenge = useGameConfigStore(
    (state) => state.cancelFindChallenge
  );

  const foundChallenge = useGameConfigStore((state) => state.foundChallenge);
  const updateSocketStatus = useGameConfigStore(
    (state) => state.updateSocketStatus
  );
  const initLeaderBoard = useGameConfigStore((state) => state.initLeaderBoard);
  const updateLeaderBoard = useGameConfigStore(
    (state) => state.updateLeaderBoard
  );
  const setOpenFGModal = useFinishGameModal((state) => state.setOpen);

  const router = useRouter();

  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);
      console.log(socket.id);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    const onFoundGame = (gameRoom: GameRoom) => {
      if (gameRoom) {
        foundChallenge(gameRoom);
        router.push("/play");
      } else {
        cancelFindChallenge();
      }
    };

    const onGameEnd = (data: { winner: string; gamePoints: number }) => {
      const { winner, gamePoints } = data;

      let finishGameStatus = FINISH_GAME_STATUS.DRAW;

      if (winner) {
        const isWin = winner === userId;
        finishGameStatus = isWin
          ? FINISH_GAME_STATUS.WIN
          : FINISH_GAME_STATUS.LOSE;
      }

      setOpenFGModal(true, {
        gamePoints,
        finishGameStatus,
      });
    };

    const onUpdateLeaderBoard = (data: { streak: number; point: number }) => {
      updateLeaderBoard(data);
    };

    const onCancelGame = () => {
      cancelFindChallenge();
      toast("Your component EXIT the game");
      router.push("/app");
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on(SOCKET_EVENTS.FOUND_GAME, onFoundGame);
    socket.on(SOCKET_EVENTS.FINISH_GAME, onGameEnd);
    socket.on(SOCKET_EVENTS.UPDATE_LEADER_BOARD_USER, onUpdateLeaderBoard);
    socket.on(SOCKET_EVENTS.CANCEL_GAME, onCancelGame);

    return () => {
      console.log("clear socket");
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off(SOCKET_EVENTS.FOUND_GAME, onFoundGame);
      socket.off(SOCKET_EVENTS.FINISH_GAME, onGameEnd);
      socket.off(SOCKET_EVENTS.UPDATE_LEADER_BOARD_USER, onUpdateLeaderBoard);
      socket.off(SOCKET_EVENTS.CANCEL_GAME, onCancelGame);
    };
  }, [
    router,
    foundChallenge,
    cancelFindChallenge,
    userId,
    setOpenFGModal,
    updateLeaderBoard,
  ]);

  useEffect(() => {
    updateSocketStatus(isConnected && transport !== "N/A");
  }, [isConnected, transport, updateSocketStatus]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const fetchUser = async () => {
      const leaderBoard = await findOrCreateLBById(userId);
      initLeaderBoard(leaderBoard);
    };

    fetchUser();
  }, [userId, initLeaderBoard]);

  return children;
};
