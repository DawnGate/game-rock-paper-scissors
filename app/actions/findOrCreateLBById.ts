"use server";

import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";

export const findOrCreateLBById = async (userId: string) => {
  const user = await clerkClient.users.getUser(userId);

  const foundUser = await prisma.leaderBoard.findUnique({
    where: {
      userId,
    },
  });

  if (foundUser) {
    return foundUser;
  }

  const newUser = await prisma.leaderBoard.create({
    data: {
      userId,
      userName: user.username ?? user.emailAddresses[0].emailAddress,
      imageUrl: user.imageUrl,
    },
  });

  return newUser;
};
