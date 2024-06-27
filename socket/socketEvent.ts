import { SOCKET_EVENTS } from "@/lib/constants";

import { socket } from "@/socket";

export const sendFindGame = (data: { userId: string }) => {
  socket.emit(SOCKET_EVENTS.FIND_GAME, data);
};

export const sendCancelFindGame = () => {
  socket.emit(SOCKET_EVENTS.CANCEL_FIND_GAME);
};

export const sendCancelCurrentGame = () => {
  socket.emit(SOCKET_EVENTS.CANCEL_GAME);
};

export const sendUserChoice = (data: { gameId: string; choice: number }) => {
  socket.emit(SOCKET_EVENTS.SEND_CHOICE_GAME, data);
};

export const sendDemoMessage = (
  data: { message: string },
  callback?: () => void
) => {
  socket.emit("message", data, (status: boolean) => {
    if (status && callback) {
      callback();
    }
  });
};
