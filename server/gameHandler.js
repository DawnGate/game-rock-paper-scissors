import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const waitingPlayers = [];
const games = {};

// action with this

const removeWaitingItem = (socketId) => {
  const itemIndex = waitingPlayers.findIndex(
    (item) => item.socketId === socketId
  );
  if (itemIndex < 0) return;
  waitingPlayers.splice(itemIndex, 1);
};

const getSocketById = async (io, socketId) => {
  const [socket] = await io.in(socketId).fetchSockets();
  return socket;
};

const createGameCombat = async ({ playerId, otherPlayerId, gamePoints }) => {
  try {
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
  } catch (err) {
    console.error(err);
    throw new Error("DB:Error", err.toString());
  }
};

const updatePointAndStreak = async ({
  gamePoints,
  isWin,
  player,
  socketId,
  io,
}) => {
  const updatedLeaderBoard = await prisma.leaderBoard.update({
    where: {
      userId: player.userId,
    },
    data: {
      streak: isWin ? player.streak + 1 : 0,
      point: isWin
        ? player.point + gamePoints
        : Math.max(player.point - gamePoints, 0),
    },
  });

  const socket = await getSocketById(io, socketId);
  socket.emit("user-leader-board:update", {
    streak: updatedLeaderBoard.streak,
    point: updatedLeaderBoard.point,
  });
};

const updateGameWinner = async ({
  gameId,
  winner,
  playerChoice,
  otherPlayerChoice,
}) => {
  try {
    const updatedGame = await prisma.game.update({
      where: {
        id: gameId,
      },
      data: {
        winner,
        playerAChoice: playerChoice,
        playerBChoice: otherPlayerChoice,
      },
      include: {
        playerA: true,
        playerB: true,
      },
    });

    return updatedGame;
  } catch (err) {
    console.error(err);
    throw new Error("DB:Error", err.toString());
  }
};

const gameHandler = (io, socket) => {
  const completeGame = async (game) => {
    try {
      const [playerId, otherPlayerId] = game.playerIds;
      const [playerChoice, otherPlayerChoice] = game.choices;
      const [playerSocketId, otherPlayerSocketId] = game.socketIds;

      const winner = findWinnerFromGame(playerChoice, otherPlayerChoice);

      if (winner === 0) {
        game.winner = null;
      } else if (winner === 1) {
        game.winner = playerId;
      } else if (winner === -1) {
        game.winner = otherPlayerId;
      }

      const gameDb = await updateGameWinner({
        gameId: game.gameId,
        winner: game.winner,
        playerChoice,
        otherPlayerChoice,
      });

      if (gameDb.winner) {
        const playerA = gameDb.playerA;
        const playerB = gameDb.playerB;

        updatePointAndStreak({
          isWin: gameDb.winner === playerA.userId,
          gamePoints: gameDb.gamePoints,
          player: playerA,
          socketId: playerSocketId,
          io,
        });

        updatePointAndStreak({
          isWin: gameDb.winner === playerB.userId,
          gamePoints: gameDb.gamePoints,
          player: playerB,
          socketId: otherPlayerSocketId,
          io,
        });
      }

      deleteGameRoomById(game.gameRoomId);
      io.to(game.gameRoomId).emit("game-status:end", {
        winner: gameDb.winner,
        gamePoints: gameDb.gamePoints,
      });
    } catch (err) {
      console.log(err);
      return;
    }
  };

  const receiveCombatValue = (socketId, gameId, choice) => {
    // check
    const game = games[gameId];

    if (!game) return false;

    if (!game.socketIds.includes(socketId)) return false;

    if (![1, 2, 3].includes(choice)) return false;

    const indexPosition = game.socketIds.indexOf(socketId);

    game.choices[indexPosition] = choice;

    const [playerChoice, otherPlayerChoice] = game.choices;

    if (playerChoice && otherPlayerChoice) {
      completeGame(game);
    }

    return true;
  };

  const waitingNewGame = async (newSocket, userId) => {
    try {
      const player = {
        socketId: newSocket.id,
        userId,
        choice: null,
      };
      if (!waitingPlayers.length) {
        waitingPlayers.push(player);
        newSocket.emit("game-status:waiting");
      } else {
        const otherPlayer = waitingPlayers.pop();

        const gamePoints = 10;

        const gameDb = await createGameCombat({
          playerId: player.userId,
          otherPlayerId: otherPlayer.userId,
          gamePoints,
        });
        const gameId = gameDb.id;

        const gameRoomId = `room-game-${gameId}`;

        const otherSocket = await getSocketById(io, otherPlayer.socketId);
        otherSocket.join(gameRoomId);
        newSocket.join(gameRoomId);

        io.to(gameRoomId).emit("game-status:found", {
          gameId,
          gameRoomId,
          playerIds: [player.userId, otherPlayer.userId],
          players: [gameDb.playerA, gameDb.playerB],
        });

        games[gameId] = {
          gameRoomId,
          gameId,
          playerIds: [player.userId, otherPlayer.userId],
          socketIds: [player.socketId, otherPlayer.socketId],
          choices: [null, null],
          winner: undefined,
          gamePoints,
        };

        setTimeout(() => {
          deleteGameRoomById(gameRoomId);
        }, 90000);
      }
    } catch (err) {
      // handle error
      return;
    }
  };

  const cancelFindGame = (socket) => {
    removeWaitingItem(socket.id);
  };

  const deleteGameRoomById = (gameRoomId) => {
    if (games[gameRoomId]) {
      io.socketsLeave(gameRoomId);
      delete games[gameRoomId];
    }
  };

  // match create
  // send back game:found event
  // send game:start event
  // send game:end event
  // receive and forward: chat message
  // receive game:user-choice
  // send game:end -> winner

  socket.on("game:user-choice", ({ gameId, choice }) => {
    receiveCombatValue(socket.id, gameId, choice);
  });

  socket.on("game:find", function ({ userId }) {
    waitingNewGame(socket, userId);
  });

  socket.on("game:cancel", function () {
    cancelFindGame(socket);
  });

  socket.on("disconnect", function () {
    // ! handle disconnect
    console.log("disconnect", socket.id);
    removeWaitingItem(socket.id);
  });

  console.log(waitingPlayers.length);
};

const findWinnerFromGame = (playerOneChoice, playerTwoChoice) => {
  // 1 -> rock, 2 -> paper, 3 -> scissors
  // return 0: draw, 1: player one, -1 : player two

  if (playerOneChoice === playerTwoChoice) return 0;

  if (playerOneChoice === 1 && playerTwoChoice === 3) {
    return 1;
  }

  if (playerOneChoice === 2 && playerTwoChoice === 1) {
    return 1;
  }

  if (playerOneChoice === 3 && playerTwoChoice === 2) {
    return 1;
  }

  return -1;
};

export default gameHandler;
