"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { Check, Copy, RefreshCcw } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import axios from "axios";
import { cn } from "@/lib/utils";

export function InviteModal() {
  const { isOpen, onOpen, onClose, type, data } = useModal();
  const origin = useOrigin();
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { server } = data;

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  const isModalOpen = isOpen && type === "invite";

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  async function generateNewLink() {
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `/api/servers/${server?.id}/invite-code`
      );
      onOpen("invite", { server: response.data });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="font-bold text-2xl text-center">
            Invite Friends
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-200">
            Server Invite Link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              disabled={isLoading}
              className="bg-zinc-300/50 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              value={inviteUrl}
            />
            <Button
              disabled={isLoading}
              onClick={handleCopy}
              size={"icon"}
              variant={"outline"}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-400" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <Button
            disabled={isLoading}
            variant={"link"}
            size={"sm"}
            onClick={generateNewLink}
            className="text-xs w-full text-zinc-700 dark:text-zinc-400"
          >
            Generate a new link
            <RefreshCcw className={cn("w-4 h-4 ml-2", isLoading && "animate-spin")} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
