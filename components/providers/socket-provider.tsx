'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

import { io as ClientIo } from 'socket.io-client';

type SocketContextType = {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  socket: any | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const socketInstance = new (ClientIo as any)(
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      process.env.NEXT_PUBLIC_SITE_URL!,
      {
        path: '/api/socket/io',
        addTrailingSlash: false,
      },
    );

    socketInstance.on('connect', () => {
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
