import socketIO from "socket.io-client";

let socket;

export const getSocket = () => {
  if (!socket) {
    const ENDPOINT = "http://localhost:4800";
    socket = socketIO(ENDPOINT, { transports: ["websocket"] });
  }
  return socket;
};
