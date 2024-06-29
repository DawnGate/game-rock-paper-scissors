import "dotenv/config";
import cookie from "cookie";
import next from "next";
import { createServer } from "node:http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

import registerGameHandler from "./gameHandler.js";

const dev = process.env.NODE_ENV !== "production";

const hostname = "localhost";
const port = 3000;
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler, {
    transports: ["polling", "websocket"],
  });

  const io = new Server(httpServer);

  io.use(async (socket, next) => {
    const cookieRaw = socket.handshake.headers.cookie;
    const cookies = cookie.parse(cookieRaw ?? "");
    const sessionToken = cookies["__session"];

    if (!sessionToken) {
      return next(new Error("Authorized Error"));
    }

    try {
      const publicKey = process.env.CLERK_PEM_PUBLIC_KEY;
      // ? Note: Don't put "" in pem key, just normal and replace newline by /n
      const decoded = jwt.verify(sessionToken, publicKey);
    } catch (err) {
      console.log(err);
      next(new Error("Authentication Error"));
    }

    next();
  });

  const onConnection = (socket) => {
    registerGameHandler(io, socket);

    socket.on("message", (value, callbackFn) => {
      console.log(value);
      callbackFn(true);
    });
  };

  io.on("connection", onConnection);

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
