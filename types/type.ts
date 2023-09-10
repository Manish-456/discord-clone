// Import necessary types and modules

import type { Server, Member, Profile } from '@prisma/client';
import { Server as NetServer, Socket } from 'net';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiResponse } from 'next';

// Define a custom type that extends the Server type from Prisma
// It includes an array of members, each of which has a profile
export type ServerWithMembersAndProfiles = Server & {
    members: (Member & { profile: Profile })[];
}

// Define a custom type that extends the NextApiResponse type from Next.js
// It includes a socket property, which in turn has a server property with an io property for Socket.IO
export type NextApiResponseServerInfo = NextApiResponse & {
    socket: Socket & {
        server: NetServer & {
            io: SocketIOServer;
        }
    };
}
