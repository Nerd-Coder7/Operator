import socketIO from "socket.io-client";

let socket;

export const getSocket = () => {
  if (!socket) {
    const ENDPOINT = process.env.REACT_APP_API_URI;
    socket = socketIO(ENDPOINT, { transports: ["websocket"] });
  }
  return socket;
};
