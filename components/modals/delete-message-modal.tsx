"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import qs from 'query-string';
import { useModal } from "@/hooks/use-modal-store";
import { Button } from "../ui/button";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export function DeleteMessageModal() {
  const router = useRouter();

  const { isOpen, onClose, type, data } = useModal();
  const [isLoading, setIsLoading] = useState(false);

  const { apiUrl, query } = data;
  const isModalOpen = isOpen && type === "deleteMessage";

  const onLeaveServer = async () => {
    const url = qs.stringifyUrl({
      url: apiUrl as string,
      query : query
    })

    try {
      setIsLoading(true);
      await axios.delete(url);
      router.refresh();

    } catch (error) {
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="font-bold text-2xl text-center">
            Delete Message
          </DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to this? <br />{" "}
        
        This message wll be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isLoading} variant={"ghost"} onClick={onClose}>
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              variant={"destructive"}
              onClick={onLeaveServer}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
