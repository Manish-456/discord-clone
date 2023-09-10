import { Hash } from "lucide-react";
import React from "react";
import { MobileToggle } from "@/components/mobile-toggle";
import { UserAvatar } from "@/components/user-avatar";
import SocketIndicator from "@/components/socket-indicator";
import ChatVideoButton from "../chat-video-button";

interface ChatHeaderProps {
  serverId: string;
  type: "channel" | "conversation";
  imageUrl?: string;
  name: string;
}
export default function ChatHeader({serverId, type, imageUrl, name} : ChatHeaderProps) {
  return (
    <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
     <MobileToggle serverId={serverId}/>
      {type === "channel" && (
        <Hash className="h-5 w-5 text-zinc-500 dark:text-zinc-400  mr-2"/>
      )}
      {type === "conversation" && <UserAvatar src={imageUrl} className="h-8 w-8 md:h-8 md:w-8 mr-2" />}
      <p className="font-semibold ml-2 text-black dark:text-white text-md">
        {name}
      </p>
      <div className="ml-auto flex items-center">
        {type === "conversation"}{
          <ChatVideoButton />
        }
        <SocketIndicator />
      </div>
    </div>
  );
}
