"use server";

import prisma from "@/lib/prisma";

export const getListLeaderBoard = async () => {
  const topTenLeaderBoard = await prisma.leaderBoard.findMany({
    orderBy: {
      point: "desc",
    },
    take: 10,
  });

  return topTenLeaderBoard;
};
