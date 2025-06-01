
"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { ServerNode, ServerNodeConnectionType } from "@/app/users/user-data";

const connectionTypes: ServerNodeConnectionType[] = ['grpclib', 'websocket', 'tcp', 'other'];

const nodeFormSchema = z.object({
  name: z.string().min(1, "Node name is required."),
  address: z.string().min(1, "Address (IP or FQDN) is required."),
  port: z.coerce.number().min(1, "Port must be a positive number.").max(65535, "Port must be less than 65536."),
  connectionType: z.enum(connectionTypes as [ServerNodeConnectionType, ...ServerNodeConnectionType[]], { required_error: "Connection type is required."}),
  consumptionFactor: z.coerce.number().min(0.1, "Consumption factor must be at least 0.1.").max(10.0, "Consumption factor cannot exceed 10.0."),
  status: z.enum(['Online', 'Offline', 'Error', 'Connecting']).default('Offline'), 
});

type NodeFormData = Omit<ServerNode, 'id'>; 

interface AddNodeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ServerNode) => void; 
  nodeData?: ServerNode | null;
}

export function AddNodeDialog({ isOpen, onClose, onSave, nodeData }: AddNodeDialogProps) {
  const form = useForm<NodeFormData>({
    resolver: zodResolver(nodeFormSchema),
    defaultValues: nodeData
      ? { ...nodeData }
      : {
          name: "",
          address: "",
          port: 443,
          connectionType: "grpclib",
          consumptionFactor: 1.0,
          status: "Offline",
        },
  });

  React.useEffect(() => {
    if (isOpen) {
      if (nodeData) {
        form.reset(nodeData);
      } else {
        form.reset({
          name: "",
          address: "",
          port: 443,
          connectionType: "grpclib",
          consumptionFactor: 1.0,
          status: "Offline",
        });
      }
    }
  }, [nodeData, form, isOpen]);

  const onSubmit = (data: NodeFormData) => {
    const dataToSave: ServerNode = {
      ...(nodeData || { id: "" }), 
      ...data,
    };
    onSave(dataToSave); 
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-headline">
            {nodeData ? "Edit Server Node" : "Add New Server Node"}
          </DialogTitle>
          <DialogDescription className="font-body">
            Configure the details for your server node.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <ScrollArea className="h-[60vh] pr-6">
              <div className="space-y-4 py-1">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-body">Node Name</FormLabel>
                      <FormControl>
                        <Input {...field} className="font-body" placeholder="e.g., My Awesome Node" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-body">Address (IP or FQDN)</FormLabel>
                      <FormControl>
                        <Input {...field} className="font-body" placeholder="e.g., node.example.com or 1.2.3.4" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="port"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-body">Port</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className="font-body" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="connectionType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-body">Connection Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="font-body">
                            <SelectValue placeholder="Select connection type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {connectionTypes.map((type) => (
                            <SelectItem key={type} value={type} className="font-body capitalize">
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="consumptionFactor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-body">Consumption Factor</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} className="font-body" />
                      </FormControl>
                      <FormDescription className="font-body text-xs">
                        Affects data usage calculation (e.g., 1.0 = normal, 1.5 = 50% higher).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="font-body">Initial Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger className="font-body">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {(['Online', 'Offline', 'Error', 'Connecting'] as ServerNode['status'][]).map((s) => (
                                <SelectItem key={s} value={s} className="font-body capitalize">
                                {s}
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                         <FormDescription className="font-body text-xs">
                            Set the initial mock status for this node.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
              </div>
            </ScrollArea>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} className="font-body">
                Cancel
              </Button>
              <Button type="submit" className="font-body">
                {nodeData ? "Save Changes" : "Add Node"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

    