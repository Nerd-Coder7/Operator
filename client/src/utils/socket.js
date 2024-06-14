import socketIO from "socket.io-client";

let socket;

export const getSocket = () => {
  if (!socket) {
    const ENDPOINT = "https://operator-steel.vercel.app";
    socket = socketIO(ENDPOINT, { transports: ["websocket"] });
  }
  return socket;
};
