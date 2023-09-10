"use client"; 

import { useState, useContext, useEffect, createContext } from "react";
import { io as ClientIO } from "socket.io-client";

// Define a TypeScript type for the socket context
type TSocketContext = {
  socket: any | null; // The socket object or null
  isConnected: boolean; // Indicates if the socket is connected
};

// Create a SocketContext with an initial value
export const SocketContext = createContext<TSocketContext>({
  socket: null, // Initial socket value is null
  isConnected: false, // Initially not connected
});

// Custom hook for accessing the socket context
export const useSocket = () => useContext(SocketContext);

// Component that provides the SocketContext to its children
export function SocketContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [socket, setSocket] = useState(null); // State for the socket object
  const [isConnected, setIsConnected] = useState(false); // State to track socket connection status

  useEffect(() => {
    // Create a new Socket.IO client instance
    const socketInstance = new (ClientIO as any)(
      process.env.NEXT_PUBLIC_SITE_URL, // Use an environment variable for the server URL
      {
        path: "/api/socket/io", // Path for the WebSocket connection
        addTrailingSlash: false, // Option to add a trailing slash to the URL
      }
    );

    // Event listener for when the socket connects
    socketInstance.on("connect", () => setIsConnected(true));

    // Event listener for when the socket disconnects
    socketInstance.on("disconnect", () => setIsConnected(false));

    // Set the socket instance in the component's state
    setSocket(socketInstance);

    // Cleanup function to disconnect the socket when the component unmounts
    return () => socketInstance.disconnect();
  }, []); // The effect runs only once, similar to componentDidMount

  // Provide the SocketContext and its values to the component's children
  return (
    <SocketContext.Provider value={{ isConnected, socket }}>
      {children}
    </SocketContext.Provider>
  );
}
