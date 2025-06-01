
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const usernameSchema = z.object({
  newUsername: z.string().min(3, "Username must be at least 3 characters."),
});

type UsernameFormData = z.infer<typeof usernameSchema>;

interface ChangeUsernameDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentUsername: string;
  onSave: (newUsername: string) => void;
}

export function ChangeUsernameDialog({ isOpen, onClose, currentUsername, onSave }: ChangeUsernameDialogProps) {
  const form = useForm<UsernameFormData>({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      newUsername: "",
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset({ newUsername: "" });
    }
  }, [isOpen, form]);

  const onSubmit = (data: UsernameFormData) => {
    onSave(data.newUsername);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Change Username</DialogTitle>
          <DialogDescription className="font-body">
            Enter a new username for the panel administrator. Current username: <strong>{currentUsername}</strong>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="newUsername"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-body">New Username</FormLabel>
                  <FormControl>
                    <Input {...field} className="font-body" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} className="font-body">
                Cancel
              </Button>
              <Button type="submit" className="font-body">Save Username</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
