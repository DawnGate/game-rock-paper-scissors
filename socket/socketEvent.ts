import { socket } from "@/socket";

export const sendFindGame = (data: { userId: string }) => {
  socket.emit("game:find", data);
};

export const sendCancelFindGame = () => {
  socket.emit("game:cancel");
};

export const sendUserChoice = (data: { gameId: string; choice: number }) => {
  socket.emit("game:user-choice", data);
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
