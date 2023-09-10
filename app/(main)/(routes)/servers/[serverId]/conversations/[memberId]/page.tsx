import ChatHeader from "@/components/chats/chat-header";
import ChatInput from "@/components/chats/chat-input";
import ChatMessages from "@/components/chats/chat-messages";
import MediaRoom from "@/components/media-room";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

interface IMemberIdProps {
  params: {
    serverId: string;
    memberId: string;
  };
  searchParams : {
    video? : boolean;
  }
}
export default async function MemberIdPage({ params, searchParams }: IMemberIdProps) {
  const profile = await currentProfile();
  if (!profile) return redirectToSignIn();

  const currentMember = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  if (!currentMember) return redirect("/");

  const conversation = await getOrCreateConversation(
    currentMember.id,
    params.memberId
  );

  if (!conversation) return redirect(`/servers/${params.serverId}`);

  const { memberOne, memberTwo } = conversation;

  const otherMember =
    memberOne.profileId === profile.id ? memberTwo : memberOne;

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        imageUrl={otherMember.profile.imageUrl}
        serverId={params.serverId}
        name={otherMember.profile.name}
        type="conversation"
      />
      {searchParams.video && (
        <MediaRoom video={true} audio={true} chatId={conversation.id} />
      )}
      {!searchParams.video &&  <ChatMessages
        member={currentMember}
        name={otherMember.profile.name}
        type="conversation"
        chatId={conversation.id}
        apiUrl="/api/direct-messages"
        paramKey="conversationId"
        paramValue={conversation.id}
        socketUrl={"/api/socket/direct-messages"}
        socketQuery={{
          conversationId: conversation.id,
        }}
      />}
      
      <ChatInput
        name={otherMember.profile.name}
        type="conversation"
        apiUrl="/api/socket/direct-messages"
        query={{ conversationId: conversation.id }}
      />
    </div>
  );
}
