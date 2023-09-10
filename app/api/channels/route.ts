import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(request : Request){
    try {
        const {type, name} = await request.json();
        const profile = await currentProfile();
        if(!profile) return new NextResponse("Unauthorized", {status: 401});
        
        const {searchParams} = new URL(request.url);
        const serverId = searchParams.get("serverId");

        if(!serverId) return new NextResponse("Server ID is missing", {status : 400});

        if(name === "general") return new NextResponse("Name cannot be general", {status : 400});

        const server = await db.server.update({
            where : {
                id : serverId,
                members : {
                    some : {
                        profileId : profile.id,
                        role : {
                            in : [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data : {
              channels : {
                create : [
                    {
                        profileId : profile.id,
                        name ,
                        type
                    }
                ]
              }
            }
        })

        return NextResponse.json(server);

    } catch (error) {
        console.error(`[CHANNEL_POST]`, error);
        return new NextResponse('Internal Error', {status : 500})
    }
}