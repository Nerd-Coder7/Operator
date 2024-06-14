import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSocket } from './socket';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = getSocket();
    console.log(socketInstance,"dsfdffd"
    )
    setSocket(socketInstance);
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
