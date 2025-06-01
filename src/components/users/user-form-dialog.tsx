
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { User, UserStatus } from "@/app/users/user-data"; // Updated UserStatus import
import { userStatuses, protocolOptions } from "@/app/users/user-data";
import { ScrollArea } from "@/components/ui/scroll-area";

const userFormSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters."),
  fullName: z.string().min(1, "Full name is required."),
  email: z.string().email("Invalid email address."),
  status: z.enum(userStatuses as [UserStatus, ...UserStatus[]], { required_error: "Status is required."}), // Typed enum
  kernelProfile: z.string().min(1, "Kernel profile is required."),
  protocol: z.string({ required_error: "Protocol is required."}),
  dataAllowanceGB: z.coerce.number().min(0, "Data allowance must be a positive number."),
  dataUsedGB: z.coerce.number().min(0, "Used data must be a positive number."), // Added dataUsedGB
  maxConcurrentIPs: z.coerce.number().int().min(1, "Max IPs must be at least 1."),
  validityPeriodDays: z.coerce.number().int().min(1, "Validity period must be at least 1 day."),
  notes: z.string().optional(),
}).refine(data => data.dataUsedGB <= data.dataAllowanceGB, {
  message: "Used data cannot exceed data allowance.",
  path: ["dataUsedGB"], // Point error to dataUsedGB field
});


type UserFormData = z.infer<typeof userFormSchema>;

interface UserFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
  userData?: User | null;
}

export function UserFormDialog({ isOpen, onClose, onSave, userData }: UserFormDialogProps) {
  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: userData
      ? {
          username: userData.username,
          fullName: userData.fullName,
          email: userData.email,
          status: userData.status,
          kernelProfile: userData.kernelProfile,
          protocol: userData.protocol,
          dataAllowanceGB: userData.dataAllowanceGB,
          dataUsedGB: userData.dataUsedGB, // Added dataUsedGB
          maxConcurrentIPs: userData.maxConcurrentIPs,
          validityPeriodDays: userData.validityPeriodDays,
          notes: userData.notes || "",
        }
      : {
          username: "",
          fullName: "",
          email: "",
          status: "Active",
          kernelProfile: "",
          protocol: protocolOptions[0], // Default to first protocol
          dataAllowanceGB: 10,
          dataUsedGB: 0, // Default used data
          maxConcurrentIPs: 1,
          validityPeriodDays: 30,
          notes: "",
        },
  });

  React.useEffect(() => {
    if (userData) {
      form.reset({
        username: userData.username,
        fullName: userData.fullName,
        email: userData.email,
        status: userData.status,
        kernelProfile: userData.kernelProfile,
        protocol: userData.protocol,
        dataAllowanceGB: userData.dataAllowanceGB,
        dataUsedGB: userData.dataUsedGB,
        maxConcurrentIPs: userData.maxConcurrentIPs,
        validityPeriodDays: userData.validityPeriodDays,
        notes: userData.notes || "",
      });
    } else {
       form.reset({
          username: "",
          fullName: "",
          email: "",
          status: "Active",
          kernelProfile: "",
          protocol: protocolOptions[0],
          dataAllowanceGB: 10,
          dataUsedGB: 0,
          maxConcurrentIPs: 1,
          validityPeriodDays: 30,
          notes: "",
       });
    }
  }, [userData, form, isOpen]);


  const onSubmit = (data: UserFormData) => {
    const userToSave: User = {
      ...(userData || { id: "", createdAt: new Date().toISOString() }), 
      ...data,
    };
    onSave(userToSave);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="font-headline">
            {userData ? "Edit User" : "Add New User"}
          </DialogTitle>
          <DialogDescription className="font-body">
            {userData ? "Update the details for this user." : "Fill in the details for the new user."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <ScrollArea className="h-[60vh] pr-6">
            <div className="space-y-4 py-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="username" className="font-body">Username</Label>
                  <Input id="username" {...form.register("username")} className="font-body" />
                  {form.formState.errors.username && (
                    <p className="text-sm text-destructive pt-1">{form.formState.errors.username.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="fullName" className="font-body">Full Name</Label>
                  <Input id="fullName" {...form.register("fullName")} className="font-body" />
                  {form.formState.errors.fullName && (
                    <p className="text-sm text-destructive pt-1">{form.formState.errors.fullName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="font-body">Email</Label>
                <Input id="email" type="email" {...form.register("email")} className="font-body" />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive pt-1">{form.formState.errors.email.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status" className="font-body">Status</Label>
                   <Select
                    onValueChange={(value) => form.setValue("status", value as UserStatus)}
                    defaultValue={form.getValues("status")}
                  >
                    <SelectTrigger id="status" className="font-body">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {userStatuses.map((status) => (
                        <SelectItem key={status} value={status} className="font-body">
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.status && (
                    <p className="text-sm text-destructive pt-1">{form.formState.errors.status.message}</p>
                  )}
                </div>
                 <div>
                  <Label htmlFor="protocol" className="font-body">Protocol</Label>
                  <Select
                     onValueChange={(value) => form.setValue("protocol", value)}
                     defaultValue={form.getValues("protocol")}
                  >
                    <SelectTrigger id="protocol" className="font-body">
                      <SelectValue placeholder="Select protocol" />
                    </SelectTrigger>
                    <SelectContent>
                      {protocolOptions.map((protocol) => (
                        <SelectItem key={protocol} value={protocol} className="font-body">
                          {protocol}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.protocol && (
                    <p className="text-sm text-destructive pt-1">{form.formState.errors.protocol.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="kernelProfile" className="font-body">Kernel Profile</Label>
                <Input id="kernelProfile" {...form.register("kernelProfile")} className="font-body" placeholder="e.g., High-Performance Kernel v5.4"/>
                {form.formState.errors.kernelProfile && (
                  <p className="text-sm text-destructive pt-1">{form.formState.errors.kernelProfile.message}</p>
                )}
              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Changed to 2 columns for data allowance and used */}
                <div>
                  <Label htmlFor="dataAllowanceGB" className="font-body">Data Allowance (GB)</Label>
                  <Input id="dataAllowanceGB" type="number" {...form.register("dataAllowanceGB")} className="font-body" />
                  {form.formState.errors.dataAllowanceGB && (
                    <p className="text-sm text-destructive pt-1">{form.formState.errors.dataAllowanceGB.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="dataUsedGB" className="font-body">Data Used (GB)</Label>
                  <Input id="dataUsedGB" type="number" {...form.register("dataUsedGB")} className="font-body" />
                  {form.formState.errors.dataUsedGB && (
                    <p className="text-sm text-destructive pt-1">{form.formState.errors.dataUsedGB.message}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Max IPs and Validity Period */}
                <div>
                  <Label htmlFor="maxConcurrentIPs" className="font-body">Max Concurrent IPs</Label>
                  <Input id="maxConcurrentIPs" type="number" {...form.register("maxConcurrentIPs")} className="font-body" />
                  {form.formState.errors.maxConcurrentIPs && (
                    <p className="text-sm text-destructive pt-1">{form.formState.errors.maxConcurrentIPs.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="validityPeriodDays" className="font-body">Validity (Days)</Label>
                  <Input id="validityPeriodDays" type="number" {...form.register("validityPeriodDays")} className="font-body" />
                  {form.formState.errors.validityPeriodDays && (
                    <p className="text-sm text-destructive pt-1">{form.formState.errors.validityPeriodDays.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="notes" className="font-body">Notes</Label>
                <Textarea id="notes" {...form.register("notes")} className="font-body min-h-[80px]" />
                {form.formState.errors.notes && (
                  <p className="text-sm text-destructive pt-1">{form.formState.errors.notes.message}</p>
                )}
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="font-body">
              Cancel
            </Button>
            <Button type="submit" className="font-body">
              {userData ? "Save Changes" : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
