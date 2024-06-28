// socket.js
import { Server } from "socket.io";

const setupWebSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "https://operator-gel4.onrender.com",
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
      secure: true,
    },
  });

  return io;
};

export default setupWebSocket;
