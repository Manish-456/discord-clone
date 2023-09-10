import { useSocket } from "@/providers/socket-provider";
import type { Member, Message, Profile } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

// Define the props for the useChatSocket hook
type ChatSocketProps = {
    addKey: string;
    updateKey: string;
    queryKey: string;
}

type MessageWithMemberWithProfile = Member & {
    message : Message & {
        profile : Profile
    }
}

// Define a custom hook called useChatSocket
export const useChatSocket = ({
    addKey,
    updateKey,
    queryKey
}: ChatSocketProps) => {
    // Get the socket instance from the socket provider
    const { socket } = useSocket();

    // Get the query client from react-query
    const queryClient = useQueryClient();

    // useEffect is used to perform side effects when the component mounts
    useEffect(() => {
        // Check if the socket is available
        if (!socket) return;

        // Listen for updates with the specified updateKey
        socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
            // Update the query data in the cache when a message is updated
            queryClient.setQueryData([queryKey], (oldData: any) => {
                if (!oldData || !oldData.pages || oldData.pages.length === 0) return oldData;
                const newData = oldData.pages.map((page: any) => {
                    return {
                        ...page,
                        items: page.items.map((item: MessageWithMemberWithProfile) => {
                            if (item.id === message.id) {
                                return message;
                            }
                            return item;
                        })
                    }
                });
                return {
                    ...oldData,
                    pages: newData
                }
            });
        });

        // Listen for new messages with the specified addKey
        socket.on(addKey, (message: MessageWithMemberWithProfile) => {
            // Update the query data in the cache when a new message is received
            queryClient.setQueryData([queryKey], (oldData: any) => {
                if (!oldData || !oldData.pages || oldData.pages.length === 0)
                    return {
                        pages: [{
                            items: [message],
                        }]
                    }

                const newData = [...oldData.pages];

                newData[0] = {
                    ...newData[0],
                    items: [message, ...newData[0].items]
                }
                return {
                    ...oldData,
                    pages: newData
                }
            });
        });

        // Cleanup by removing event listeners when the component unmounts
        return () => {
            socket.off(addKey);
            socket.off(updateKey);
        }
    }, [socket, queryKey, addKey, queryClient, updateKey]);
}
