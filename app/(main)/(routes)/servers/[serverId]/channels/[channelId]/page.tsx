import React from "react";
import { currentProfile } from "@/lib/current-profile";
import { redirectToSignIn } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import ChatHeader from "@/components/chats/chat-header";
import ChatInput from "@/components/chats/chat-input";
import ChatMessages from "@/components/chats/chat-messages";

interface IChannelProps {
  params: {
    serverId: string;
    channelId: string;
  };
}
export default async function ChannelIdPage({ params }: IChannelProps) {
  const profile = await currentProfile();
  if (!profile) return redirectToSignIn();

  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
  });

  if (!channel) return redirect("/");

  return <div className="bg-white dark:bg-[#313338] flex flex-col min-h-screen">
   <ChatHeader serverId={params.serverId} type="channel" name={channel.name} imageUrl={""}/>
    <ChatMessages
    name={channel.name}
    member={member!}
    chatId={channel.id}
    apiUrl="/api/messages"
    socketUrl={"/api/socket/messages"}
    socketQuery={{
      channelId : channel.id,
      serverId : channel.serverId
    }}
    paramKey="channelId"
    paramValue={channel.id}
    type="channel"
    />

   <ChatInput  name={channel.name} apiUrl={"/api/socket/messages"} query={{
    channelId : channel.id,
    serverId : channel.serverId,
  }}
  type={"channel"}
   />
  </div>;
}
