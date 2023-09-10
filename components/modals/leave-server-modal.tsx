"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import { Button } from "../ui/button";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export function LeaveServerModal() {
  const router = useRouter();
  const { isOpen, onOpen, onClose, type, data } = useModal(); 
  const [isLoading, setIsLoading] = useState(false);

  const { server } = data;


  const isModalOpen = isOpen && type === "leaveServer";

  const onLeaveServer = async() => {
    try {
      setIsLoading(true);
      await axios.patch(`/api/servers/${server?.id}/leave`);
      router.refresh();
      router.push('/')
    } catch (error) {
    }finally {
      setIsLoading(false);
      onClose();
    }
  }


  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="font-bold text-2xl text-center">
            Leave Server
          </DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to leave <span className="font-semibold text-indigo-500">{server?.name}</span> ?
          </DialogDescription>
        </DialogHeader>
     <DialogFooter  className="px-6 py-4">
  <div className="flex items-center justify-between w-full">
    <Button disabled={isLoading} variant={'ghost'} onClick={onClose}>Cancel</Button>
    <Button disabled={isLoading} variant={'destructive'} onClick={onLeaveServer}>Confirm</Button>
  </div>
     </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
