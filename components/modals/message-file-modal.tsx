"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Button } from "@/components/ui/button";

import FileUpload from "../file-upload";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import qs from 'query-string';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem
} from "@/components/ui/form";



const formSchema = z.object({
  fileUrl: z.string().min(1, { message: `Server image is required.` }),
});
export function MessageFileModal() {
  const {isOpen, onClose, type, data} = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "messageFile";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {

      fileUrl: "",
    },
  });

  const isLoading = form.formState.isSubmitting;
  const {apiUrl, query} = data
  async function onSubmit(values: z.infer<typeof formSchema>) {
    
    try {
      const url = qs.stringifyUrl({
        url : apiUrl || "",
        query
      })
      await axios.post(url, {
        ...values,
        content : values.fileUrl
      });
      form.reset();
      router.refresh();
      handleClose();
    } catch (error) {
      ;
    }
  }

  function handleClose(){
    form.reset();
    onClose();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="font-bold text-2xl text-center">
            Customize your server.
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your server a personality with a name and an image. You can
            always change it later.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-8">
                <div className="flex items-center justify-center text-center">
                  <FormField
                    control={form.control}
                    name="fileUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FileUpload
                            endPoint="messageFile"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
           
              </div>
              <DialogFooter>
                <Button disabled={isLoading} className="w-full" type="submit" variant={"primary"}>
                  Send
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
