"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import qs from "query-string";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { useModal } from "@/hooks/use-modal-store";
import { ChannelType } from "@prisma/client";
import { useEffect } from "react";

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: `Channel name is required.` })
    .refine((name) => name !== "general", {
      message: "Channel name cannot be ' general '",
    }),

  type: z.nativeEnum(ChannelType),
});
export function EditChannelModal() {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "editChannel";
  const { channel, server } = data;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: ChannelType.TEXT,
    },
  });

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const url = qs.stringifyUrl({
      url: `/api/channels/${channel?.id}`,
      query: {
        serverId: server?.id,
      },
    });
    try {
      await axios.patch(url, values);
      form.reset();
      router.refresh();
      onClose();
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (channel) {
      form.setValue("name", channel.name);
      form.setValue("type", channel.type);
    }
  }, [form, channel]);

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="font-bold text-2xl text-center">
            Edit Channel.
          </DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Channel Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          placeholder="Enter channel name"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Channel Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        disabled={isLoading}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className=" border-0 focus:ring-0 ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                            <SelectValue placeholder="Select a Channel Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.keys(ChannelType).map((channel) => (
                            <SelectItem
                              key={channel}
                              value={channel}
                              className="capitalize"
                            >
                              {channel.toLowerCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button disabled={isLoading} type="submit" variant={"primary"}>
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
