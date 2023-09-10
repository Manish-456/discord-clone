"use client";
import React from 'react'
import { Badge } from '@/components/ui/badge'
import { useSocket } from '@/providers/socket-provider';

export default function SocketIndicator() {
   const {isConnected} = useSocket();
   if(!isConnected){

       return (
           <div>
    <Badge variant={"destructive"} className='border-none'>Fallback: Polling every 1s</Badge>     
    </div>
  )
}
return (
    <div>
        <Badge variant={"outline"} className='bg-emerald-600 text-white border-none'>
            Live : Real-time-update
        </Badge>
    </div>
)
}
