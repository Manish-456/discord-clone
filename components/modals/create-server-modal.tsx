"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Button } from "@/components/ui/button";

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
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import FileUpload from "../file-upload";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";

// a schema for form data validation using zod;
const formSchema = z.object({
  name: z.string().min(1, { message: `Server name is required.` }),
  imageUrl: z.string().min(1, { message: `Server image is required.` }),
});
export function CreateServerModal() {
  const {isOpen, onClose, type} = useModal();
  const router = useRouter();
 
  // Check if the modal is open and its type is "createServer"
  const isModalOpen = isOpen && type === "createServer";

  // Initialize the form using react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema), // Use Zod resolver for validation
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });
 
  // Check if the form is in a loading state
  const isLoading = form.formState.isSubmitting;

  // Function to handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Send a POST request to create a new server
      await axios.post(`/api/servers`, values);
      form.reset(); // Reset the form after the successful submission.
      router.refresh(); // Refresh the router to update the page.
      onClose(); // Close the modal
    } catch (error) {
      console.error(error);
    }
  }

  const handleClose = () => {
    form.reset(); // Reset the form 
    onClose(); // Close the modal
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
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FileUpload
                            endPoint="serverImage"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Server Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          placeholder="Enter server name"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button disabled={isLoading} type="submit" variant={"primary"}>
                  Create
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
