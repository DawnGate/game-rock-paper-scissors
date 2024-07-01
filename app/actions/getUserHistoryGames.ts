"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const getUserHistoryGames = async () => {
  const { userId } = auth();

  if (!userId) return [];

  const games = prisma.game.findMany({
    take: 4,
    where: {
      OR: [
        {
          playerAId: userId,
        },
        {
          playerBId: userId,
        },
      ],
    },
    include: {
      playerA: true,
      playerB: true,
    },
    orderBy: {
      updatedAt: "asc",
    },
  });

  return games;
};
