import socketIO from "socket.io-client";

let socket;

export const getSocket = () => {
  if (!socket) {
    const ENDPOINT = "https://operator-gel4.onrender.com";
    socket = socketIO(ENDPOINT, { transports: ["websocket"] });
  }
  return socket;
};
