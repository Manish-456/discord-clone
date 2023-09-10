import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";



export async function PATCH(request : Request,
     {params} : {
        params :
         {
            serverId : string}}){
    try {
        const {name, imageUrl} = await request.json();
        const profile = await currentProfile();

        if(!profile) return new NextResponse("Unauthorized", {status : 401});

        if(!params.serverId) return new NextResponse("Server ID missing", {status : 400});

        const server = await db.server.update({
            where : {
                id : params.serverId,
                profileId : profile.id
            },
            data : {
              name,
              imageUrl      
            }
        })

        return NextResponse.json(server);
    
    } catch (error) {
        console.log(`[SERVER_ID]{PATCH}`, error);
        throw new NextResponse('Internal Server Error', {status : 500});
    }
}



export async function DELETE(request : Request,
     {params} : {
        params :
         {
            serverId : string}}){
    try {
        const profile = await currentProfile();

        if(!profile) return new NextResponse("Unauthorized", {status : 401});

        if(!params.serverId) return new NextResponse("Server ID missing", {status : 400});

        const server = await db.server.deleteMany({
           where : {
            id : params.serverId,
            profileId : profile.id
           }
        })

        return NextResponse.json(server);
    
    } catch (error) {
        console.log(`[SERVER_ID]{DELETE}`, error);
        throw new NextResponse('Internal Server Error', {status : 500});
    }
}