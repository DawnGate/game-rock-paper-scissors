import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const dbErrorHandler = (func) => {
  function wrapperFunc(...args) {
    try {
      // return func(...args)
      return func.apply(this, args);
    } catch (err) {
      console.error("Prisma:db", err);
      throw new Error("DB:Error", err.toString());
    }
  }

  return wrapperFunc;
};

const createNewGame = async ({ playerId, otherPlayerId, gamePoints }) => {
  const newGame = await prisma.game.create({
    data: {
      playerAId: playerId,
      playerBId: otherPlayerId,
      gamePoints,
    },
    include: {
      playerA: true,
      playerB: true,
    },
  });

  return newGame;
};

const updateGame = async ({
  gameId,
  winner,
  playerChoice,
  otherPlayerChoice,
}) => {
  // update with winner, playerChoice, otherPlayerChoice if exist
  const updatedGame = await prisma.game.update({
    where: {
      id: gameId,
    },
    data: {
      winner: winner || undefined,
      playerAChoice: playerChoice || undefined,
      playerBChoice: otherPlayerChoice || undefined,
    },
    include: {
      playerA: true,
      playerB: true,
    },
  });

  return updatedGame;
};

const updateLeaderBoardUser = async ({ userId, newPoint, newStreak }) => {
  const updatedUser = await prisma.leaderBoard.update({
    where: {
      userId,
    },
    data: {
      streak: newStreak,
      point: newPoint,
    },
  });

  return updatedUser;
};

export const dbActions = {
  createNewGame: dbErrorHandler(createNewGame),
  updateGame: dbErrorHandler(updateGame),
  updateLeaderBoardUser: dbErrorHandler(updateLeaderBoardUser),
};
