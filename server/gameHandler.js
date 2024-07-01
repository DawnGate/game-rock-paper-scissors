import { socketEvents } from "./socketEvents.js";
import { dbActions } from "./dbActions.js";

const gameTimeout = Number(process.env.NEXT_PUBLIC_GAME_SECONDS);

const waitingPlayers = [];
const games = {};

// action with this
const removeWaitingPlayerBySocketId = ({ socketId }) => {
  const itemIndex = waitingPlayers.findIndex(
    (item) => item.socketId === socketId
  );
  if (itemIndex < 0) return;
  waitingPlayers.splice(itemIndex, 1);
};

const cancelGameBySocketId = async ({ socketId }, callback) => {
  const foundGame = Object.values(games).find((item) =>
    item.socketIds.includes(socketId)
  );

  if (!foundGame) return;

  callback({
    game: foundGame,
  });
};

const updatePointAndStreak = async (
  { gamePoints, isWin, player },
  callback
) => {
  const newStreak = isWin ? player.streak + 1 : 0;
  const newPoint = isWin
    ? player.point + gamePoints
    : Math.max(player.point - gamePoints, 0);

  const updatedLeaderBoard = await dbActions.updateLeaderBoardUser({
    userId: player.userId,
    newPoint,
    newStreak,
  });

  callback({ leaderBoard: updatedLeaderBoard });
};

const findWinnerFromGame = ({ playerOneChoice, playerTwoChoice }) => {
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

const gameHandler = (io, socket) => {
  const deleteGameByGameId = ({ gameId }) => {
    const game = games[gameId];
    game.clearCurrentTimeout();
    if (!game) return;
    io.socketsLeave(game.gameRoomId);
    delete games[gameId];
  };

  const getSocketById = async ({ socketId }) => {
    const [socket] = await io.in(socketId).fetchSockets();
    return socket;
  };

  const timeoutGame = async ({ game }) => {
    const [playerChoice, otherPlayerChoice] = game.choices;
    const [playerId, otherPlayerId] = game.playerIds;
    const [playerSocketId, otherPlayerSocketId] = game.socketIds;

    let winner = null;
    const gamePoints = game.gamePoints;

    if (playerChoice || otherPlayerChoice) {
      winner = playerChoice ? playerId : otherPlayerId;
    }

    const updatedGame = await dbActions.updateGame({
      gameId: game.gameId,
      winner: winner ?? undefined,
      playerChoice,
      otherPlayerChoice,
    });

    const playerA = updatedGame.playerA;
    const playerB = updatedGame.playerB;

    updatePointAndStreak(
      {
        isWin: updatedGame.winner === playerA.userId,
        gamePoints: updatedGame.gamePoints,
        player: playerA,
      },
      async ({ leaderBoard }) => {
        const socket = await getSocketById({
          socketId: playerSocketId,
        });

        if (!socket) return;

        socket.emit(socketEvents.UPDATE_LEADER_BOARD_USER, {
          streak: leaderBoard.streak,
          point: leaderBoard.point,
        });
      }
    );

    updatePointAndStreak(
      {
        isWin: updatedGame.winner === playerB.userId,
        gamePoints: updatedGame.gamePoints,
        player: playerB,
      },
      async ({ leaderBoard }) => {
        const socket = await getSocketById({
          socketId: otherPlayerSocketId,
        });

        if (!socket) return;

        socket.emit(socketEvents.UPDATE_LEADER_BOARD_USER, {
          streak: leaderBoard.streak,
          point: leaderBoard.point,
        });
      }
    );

    io.to(game.gameRoomId).emit(socketEvents.TIMEOUT_GAME, {
      winner: updatedGame.winner,
      gamePoints,
    });

    deleteGameByGameId({ gameId: game.gameId });
  };

  const finishGame = async ({ game }) => {
    const [playerId, otherPlayerId] = game.playerIds;
    const [playerChoice, otherPlayerChoice] = game.choices;
    const [playerSocketId, otherPlayerSocketId] = game.socketIds;

    const winner = findWinnerFromGame({
      playerOneChoice: playerChoice,
      playerTwoChoice: otherPlayerChoice,
    });

    if (winner === 0) {
      game.winner = null;
    } else if (winner === 1) {
      game.winner = playerId;
    } else if (winner === -1) {
      game.winner = otherPlayerId;
    }

    const gameDb = await dbActions.updateGame({
      gameId: game.gameId,
      winner: game.winner,
      playerChoice,
      otherPlayerChoice,
    });

    if (gameDb.winner) {
      const playerA = gameDb.playerA;
      const playerB = gameDb.playerB;

      updatePointAndStreak(
        {
          isWin: gameDb.winner === playerA.userId,
          gamePoints: gameDb.gamePoints,
          player: playerA,
        },
        async ({ leaderBoard }) => {
          const socket = await getSocketById({
            socketId: playerSocketId,
          });

          if (!socket) return;

          socket.emit(socketEvents.UPDATE_LEADER_BOARD_USER, {
            streak: leaderBoard.streak,
            point: leaderBoard.point,
          });
        }
      );

      updatePointAndStreak(
        {
          isWin: gameDb.winner === playerB.userId,
          gamePoints: gameDb.gamePoints,
          player: playerB,
        },
        async ({ leaderBoard }) => {
          const socket = await getSocketById({
            socketId: otherPlayerSocketId,
          });

          if (!socket) return;

          socket.emit(socketEvents.UPDATE_LEADER_BOARD_USER, {
            streak: leaderBoard.streak,
            point: leaderBoard.point,
          });
        }
      );
    }

    io.to(game.gameRoomId).emit(socketEvents.FINISH_GAME, {
      winner: gameDb.winner,
      gamePoints: gameDb.gamePoints,
    });

    deleteGameByGameId({ gameId: game.gameId });
  };

  const receiveCombatValue = ({ socketId, gameId, choice }) => {
    // check
    const game = games[gameId];

    if (!game) return false;

    if (!game.socketIds.includes(socketId)) return false;

    if (![1, 2, 3].includes(choice)) return false;

    const indexPosition = game.socketIds.indexOf(socketId);

    game.choices[indexPosition] = choice;

    const [playerChoice, otherPlayerChoice] = game.choices;

    if (playerChoice && otherPlayerChoice) {
      finishGame({ game });
    }

    return true;
  };

  const waitingNewGame = async ({ newSocket, userId }) => {
    // create new player
    const player = {
      socketId: newSocket.id,
      userId,
      choice: null,
    };

    // check if not have any waiting player in list
    if (!waitingPlayers.length) {
      waitingPlayers.push(player);
      newSocket.emit(socketEvents.WAITING_GAME);
      return;
    }

    // match game, create a new game
    const otherPlayer = waitingPlayers.pop();

    const gamePoints = 10;

    const gameDb = await dbActions.createNewGame({
      playerId: player.userId,
      otherPlayerId: otherPlayer.userId,
      gamePoints,
    });

    const gameId = gameDb.id;

    const gameRoomId = `room-game-${gameId}`;

    const otherSocket = await getSocketById({ socketId: otherPlayer.socketId });

    otherSocket.join(gameRoomId);
    newSocket.join(gameRoomId);

    io.to(gameRoomId).emit(socketEvents.FOUND_GAME, {
      gameId,
      gameRoomId,
      playerIds: [player.userId, otherPlayer.userId],
      players: [gameDb.playerA, gameDb.playerB],
    });

    const currentTimeout = setTimeout(async () => {
      const foundGame = games[gameId];

      if (!foundGame) return;

      timeoutGame({ game: foundGame });
    }, gameTimeout * 1000);

    games[gameId] = {
      gameRoomId,
      gameId,
      playerIds: [player.userId, otherPlayer.userId],
      socketIds: [player.socketId, otherPlayer.socketId],
      choices: [null, null],
      winner: undefined,
      gamePoints,
      clearCurrentTimeout: () => {
        clearTimeout(currentTimeout);
      },
    };
  };

  const cancelGame = ({ socketId }) => {
    removeWaitingPlayerBySocketId({ socketId });
    cancelGameBySocketId({ socketId }, async ({ game }) => {
      deleteGameByGameId({ gameId: game.gameId });

      const [playerSocketId, otherPlayerSocketId] = game.socketIds;
      const [playerChoice, otherPlayerChoice] = game.choices;

      const gameDb = await dbActions.updateGame({
        gameId: game.gameId,
        playerChoice,
        otherPlayerChoice,
      });

      // notify game cancel for other player
      const notifySocketId =
        socketId === playerSocketId ? otherPlayerSocketId : playerSocketId;

      const notifySocket = await getSocketById({ socketId: notifySocketId });

      if (!notifySocket) return;

      notifySocket.emit(socketEvents.CANCEL_GAME);

      // update point for cancel player
      const cancelPlayer =
        socketId === playerSocketId ? gameDb.playerA : gameDb.playerB;
      updatePointAndStreak(
        {
          isWin: false,
          gamePoints: gameDb.gamePoints,
          player: cancelPlayer,
        },
        async ({ leaderBoard }) => {
          const socket = await getSocketById({
            socketId: socketId,
          });

          if (!socket) return;

          socket.emit(socketEvents.UPDATE_LEADER_BOARD_USER, {
            streak: leaderBoard.streak,
            point: leaderBoard.point,
          });
        }
      );
    });
  };

  // socket listener
  socket.on(socketEvents.FIND_GAME, function ({ userId }) {
    waitingNewGame({ newSocket: socket, userId });
  });

  socket.on(socketEvents.CANCEL_FIND_GAME, function () {
    removeWaitingPlayerBySocketId({ socketId: socket.id });
  });

  socket.on(socketEvents.SEND_CHOICE_GAME, ({ gameId, choice }) => {
    receiveCombatValue({ socketId: socket.id, gameId, choice });
  });

  socket.on(socketEvents.CANCEL_GAME, function () {
    cancelGame({ socketId: socket.id });
  });

  socket.on("disconnect", function () {
    cancelGame({ socketId: socket.id });
  });
};

export default gameHandler;
