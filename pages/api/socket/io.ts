import { Server as NetServer } from 'http';
import { NextApiRequest } from 'next';
import { Server as SocketIO } from 'socket.io';
import { NextApiResponseServerInfo } from '@/types/type';

export const config = {
  api: {
    bodyParser: false
  }
};

// Define a function to handle WebSocket connections
const ioHandler = (req: NextApiRequest, res: NextApiResponseServerInfo) => {
  // Check if the WebSocket server has already been initialized
  if (!res.socket.server.io) {
    const path = "/api/socket/io";
    
    // Get the HTTP server from the response's socket
    const httpServer: NetServer = res.socket.server as any;

    // Initialize a new Socket.IO server, passing in the HTTP server
    const io = new SocketIO(httpServer, {
      path: path,
      // @ts-ignore
      addTrailingSlash: false
    });

    // Store the Socket.IO server instance in the response's socket server property
    res.socket.server.io = io;
  }

  // End the API request
  res.end();
}

export default ioHandler;
