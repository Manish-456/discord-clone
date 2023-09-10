import React from "react";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import ServerSidebar from "@/components/server/server-sidebar";

export default async function ServerIdLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    serverId: string;
  };
}) {
  const profile = await currentProfile();

  if (!profile) redirectToSignIn();

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile?.id,
        },
      },
    },
  });

  if (!server) return redirect("/");

  return <div className="h-full ">
    <div className="md:flex hidden w-60 z-20 flex-col inset-y-0 fixed h-full">
      <ServerSidebar  serverId={params.serverId}/>
    </div>
    <main className="h-full md:pl-60">
    {children}

    </main>
    </div>;
}
