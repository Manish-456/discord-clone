import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerInfo } from "@/types/type";
import { MemberRole } from "@prisma/client";
import { NextApiRequest } from "next";

export default async function handler(req : NextApiRequest, res : NextApiResponseServerInfo){
    if(req.method !== "PATCH" && req.method !== "DELETE"){
        return res.status(405).json({error : "Method not allowed"})
    }


  try {
    const profile = await currentProfilePages(req);
    const {directMessageId, conversationId} = req.query;
    const {content} = req.body;

    if(!profile) return res.status(401).json({error : "Unauthorized"});
    if(!directMessageId) return res.status(401).json({error : "Message ID missing"});
    if(!conversationId) return res.status(401).json({error : "Conversation ID missing"});
    

  const conversation = await db.conversation.findFirst({
    where : {
        id : conversationId as string,
        OR : [
            {
                memberOne : {
                    profileId : profile.id
                },
            },{
                memberTwo : {
                    profileId : profile.id
                }

            }
        ]
    },
    include : {
        memberOne : {
         include : {
            profile : true
         }
        },
        memberTwo : {
            include : {
                profile : true
            }
        }
    }
  })

  if(!conversation) return res.status(404).json({error : "Conversation not found"});

    const member = conversation.memberOne.profileId === profile.id ? conversation.memberOne : conversation.memberTwo;

    if(!member) return res.status(404).json({error : "Member not found"});

    let directMessage = await db.directMessage.findFirst({
        where : {
            id : directMessageId as string,
        },
        include : {
            member : {
                include : {
                    profile : true
                }
            }
        }
    })

    if(!directMessage || directMessage.deleted) return res.status(404).json({error : "Message not found"});

    const isMessageOwner = directMessage.memberId === member?.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = isMessageOwner || member.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator
   
    if(!canModify) return res.status(401).json({error : "Unauthorized"});

    if(req.method === "DELETE"){
        if(!isMessageOwner) return res.status(401).json({error : "Unauthorized"});
        directMessage = await db.directMessage.update({
            where : {
                id : directMessageId as string
            },
            data : {
                content : "This message has been deleted.",
                fileUrl : "",
                deleted : true
            },
            include : {
                member : {
                    include : {
                        profile : true
                    }
                }
            }
        })
    }

    if(req.method === "PATCH"){
        if(!isMessageOwner) return res.status(401).json({error : "Unauthorized"});        
        directMessage = await db.directMessage.update({
            where : {
                id : directMessageId as string
            },
            data : {
                content
            },
            include : {
                member : {
                    include : {
                        profile : true
                    }
                }
            }
        })
    }

    const updateKey = `chat:${conversation.id}:update`;
    res?.socket?.server?.io?.emit(updateKey, directMessage);
    return res.status(200).json(directMessage)
   
  } catch (error) {
    console.error(`[SOCKET_DIRECT_MESSAGES_MESSAGEID]`, error);
    return res.status(500).json({error : "Internal Error"});
  }
}