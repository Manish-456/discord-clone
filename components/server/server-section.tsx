"use client";

import { ServerWithMembersAndProfiles } from "@/types/type";
import { ChannelType, MemberRole } from "@prisma/client";
import React from "react";
import ActionTooltip from "../action-tooltip";
import { Plus, Settings } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";
interface IServerSection {
  label: string;
  role: MemberRole;
  sectionType: "channels" | "members";
  channelType?: ChannelType;
  server?: ServerWithMembersAndProfiles;
}
export default function ServerSection({
  label,
  role,
  sectionType,
  channelType,
  server,
}: IServerSection) {
    const {onOpen} = useModal();
  return <div className="flex items-center justify-between py-2">
    <p className="text-xs uppercase text-zinc-500 dark:text-zinc-400">
        {label}
    </p>
    {role !== MemberRole.GUEST && sectionType === "channels" && (
        <ActionTooltip label="Create Channel" side="top">
            <button
            onClick={() => onOpen('createChannel', {channelType})}
            className="text-zinc-500
            hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition">
                <Plus className="h-4 w-4"/>
            </button>
        </ActionTooltip>
    )}

    {role === MemberRole.ADMIN && sectionType === "members" && (
             <ActionTooltip label="Manage Members" side="top">
             <button
             onClick={() => onOpen("members", {server})}
             className="text-zinc-500
             hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition">
                 <Settings className="h-4 w-4"/>
             </button>
         </ActionTooltip>
    )}
  </div>;
}
