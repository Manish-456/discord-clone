import {FileIcon, X} from 'lucide-react';
import Image from 'next/image'; 
import React from 'react'
import { UploadDropzone } from '@/lib/uploadthing';
import "@uploadthing/react/styles.css";


interface IFileUpload {
    endPoint : "messageFile" | "serverImage";
    onChange : (url? : string) => void;
    value : string;

}
export default function FileUpload({endPoint, value, onChange} : IFileUpload) {
    const fileType = value?.split('.').pop();

    if(value && fileType !== "pdf"){
        return (
            <div className='relative h-20 w-20'>
                <Image src={value} alt='server-image' className='rounded-full' fill />
                <button type='button' onClick={() => onChange("")} className='absolute bg-rose-500 text-white p-1 top-0 right-0 shadow-sm rounded-full'>
                    <X className='h-4 w-4'/>
                </button>
            </div>
        )
    }

    if(value && fileType==="pdf"){
    return (
        <div className="flex items-center p-2 relative mt-2 rounded-md bg-background/10">
            <FileIcon className='h-10 w-10 fill-indigo-200 stroke-indigo-400' />
            <a href={value} target='_blank' rel='noopener noreferrer' className='ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline'>
                {value}
            </a>
            <button type='button' onClick={() => onChange("")} className='absolute bg-rose-500 -top-2 text-white p-1  -right-2 shadow-sm rounded-full'>
                    <X className='h-4 w-4'/>
                </button>
        </div>
    )
    }
  return (
    <div>
   <UploadDropzone
        endpoint={endPoint}
        onClientUploadComplete={(res) => {
        onChange(res?.[0].url)
        }}
        onUploadError={(error: Error) => {
            ;
        }}
      />
    </div>
  )
}
