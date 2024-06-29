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
      let publicKey = process.env.CLERK_PEM_PUBLIC_KEY;
      publicKey = convertPEMToOriginal(publicKey);
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

// utilities

const convertPEMToOriginal = (pem_str) => {
  let tmp_pem = pem_str;
  if (!tmp_pem) return "";
  if (tmp_pem.startsWith('"')) {
    tmp_pem = tmp_pem.replaceAll('"', "").replaceAll("\\n", "\n");
  }
  return tmp_pem;
};
