import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";

export async function PATCH(request : Request, {
    params  
} : {
    params : {
        memberId : string
    }
}){
  try {
      const {role} = await request.json();
      const profile = await currentProfile();
      const {searchParams} = new URL(request.url);

    if(!profile) return new NextResponse('Unauthorized', {status : 401});
    if(!params.memberId) return new NextResponse("Member ID missing", {status : 400});
      
    const serverId = searchParams.get('serverId');

    if(!serverId) return new NextResponse('Server ID missing', {status : 400});

    const server = await db.server.update({
        where : {
            id : serverId,
            profileId : profile.id
        },
        data : {
            members : {
                update : {
                    where : {
                        id : params.memberId,
                        profileId : {
                            not : profile.id
                        }
                    },
                    data : {
                        role
                    }
                }
            }
        },
        include : {
            members : {
                include : {
                    profile : true
                },
                orderBy : {
                    role : "asc"
                }
            }
        }
    })

  return NextResponse.json(server)

  } catch (error) {
    console.error(`[MEMBER_PATCH]`, error);
    return new NextResponse("Internal Error", {status : 500});
  }
}
export async function DELETE(request : Request, {
    params  
} : {
    params : {
        memberId : string
    }
}){
  try {
      const profile = await currentProfile();
      const {searchParams} = new URL(request.url);

    if(!profile) return new NextResponse('Unauthorized', {status : 401});
    if(!params.memberId) return new NextResponse("Member ID missing", {status : 400});
      
    const serverId = searchParams.get('serverId');

    if(!serverId) return new NextResponse('Server ID missing', {status : 400});

    const server = await db.server.update({
        where : {
            id : serverId,
            profileId : profile.id
        },
        data : {
            members : {
                deleteMany : {
                        id : params.memberId,
                        profileId : {
                            not : profile.id
                    }      
                }
            }
        },
        include : {
            members : {
                include : {
                    profile : true
                },
                orderBy : {
                    role : "asc"
                }
            }
        }
    })

  return NextResponse.json(server)

  } catch (error) {
    console.error(`[MEMBER_DELETE]`, error);
    return new NextResponse("Internal Error", {status : 500});
  }
}