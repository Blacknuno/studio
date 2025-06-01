
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
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { ManagedHost } from "@/app/users/user-data";

const hostFormSchema = z.object({
  name: z.string().min(1, "Host configuration name is required."),
  hostName: z.string().min(1, "Host Name (e.g., domain for SNI/Host header) is required."),
  address: z.string().min(1, "Address (IP or FQDN) of the service is required."),
  port: z.coerce.number().min(1, "Port must be a positive number.").max(65535, "Port must be less than 65536."),
  networkConfig: z.string().refine((val) => {
    try { JSON.parse(val); return true; } catch { return false; }
  }, { message: "Invalid JSON format for network configuration." }),
  streamSecurityConfig: z.string().refine((val) => {
    try { JSON.parse(val); return true; } catch { return false; }
  }, { message: "Invalid JSON format for stream security configuration." }),
  muxConfig: z.string().refine((val) => {
    try { JSON.parse(val); return true; } catch { return false; }
  }, { message: "Invalid JSON format for MUX configuration." }),
  notes: z.string().optional(),
});

type HostFormData = Omit<ManagedHost, 'id'>;

interface AddHostDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ManagedHost) => void;
  hostData?: ManagedHost | null;
}

const defaultNetworkConfigPlaceholder = `{
  "network": "ws", // e.g., "tcp", "kcp", "ws", "http", "grpc"
  "wsSettings": {
    "path": "/your-path", // Camouflage path
    "headers": {
      "Host": "your.domain.com" // SNI/Host header for camouflage
    }
  }
  // Add other relevant settings for chosen network type
}`;

const defaultStreamSecurityConfigPlaceholder = `{
  "security": "tls", // e.g., "tls", "reality"
  "tlsSettings": {
    "serverName": "your.domain.com", // SNI
    "alpn": ["h2", "http/1.1"]
    // "certificates": [{ "certificateFile": "/path/to/cert.pem", "keyFile": "/path/to/key.pem" }]
  }
  // Add REALITY settings if "security": "reality"
}`;

const defaultMuxConfigPlaceholder = `{
  "enabled": false, // true or false
  "concurrency": 8 // if enabled
}`;

export function AddHostDialog({ isOpen, onClose, onSave, hostData }: AddHostDialogProps) {
  const form = useForm<HostFormData>({
    resolver: zodResolver(hostFormSchema),
    defaultValues: hostData
      ? { ...hostData }
      : {
          name: "",
          hostName: "",
          address: "",
          port: 443,
          networkConfig: defaultNetworkConfigPlaceholder,
          streamSecurityConfig: defaultStreamSecurityConfigPlaceholder,
          muxConfig: defaultMuxConfigPlaceholder,
          notes: "",
        },
  });

  React.useEffect(() => {
    if (isOpen) {
      if (hostData) {
        form.reset(hostData);
      } else {
        form.reset({
          name: "",
          hostName: "",
          address: "",
          port: 443,
          networkConfig: defaultNetworkConfigPlaceholder,
          streamSecurityConfig: defaultStreamSecurityConfigPlaceholder,
          muxConfig: defaultMuxConfigPlaceholder,
          notes: "",
        });
      }
    }
  }, [hostData, form, isOpen]);

  const onSubmit = (data: HostFormData) => {
    const dataToSave: ManagedHost = {
      ...(hostData || { id: "" }),
      ...data,
    };
    onSave(dataToSave);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="font-headline">
            {hostData ? "Edit Managed Host" : "Add New Managed Host"}
          </DialogTitle>
          <DialogDescription className="font-body">
            Configure the details for this host endpoint. Use JSON for advanced network, security, and MUX settings.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <ScrollArea className="h-[70vh] pr-6">
              <div className="space-y-4 py-1">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-body">Configuration Name</FormLabel>
                      <FormControl>
                        <Input {...field} className="font-body" placeholder="e.g., Primary VLESS WS Host" />
                      </FormControl>
                      <FormDescription className="font-body text-xs">A friendly name for this host setup.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                    control={form.control}
                    name="hostName"
                    render={({ field }) => (
                        <FormItem className="md:col-span-2">
                        <FormLabel className="font-body">Host Name (SNI/HTTP Host)</FormLabel>
                        <FormControl>
                            <Input {...field} className="font-body" placeholder="e.g., your.domain.com" />
                        </FormControl>
                        <FormDescription className="font-body text-xs">Used for TLS SNI and/or HTTP Host header.</FormDescription>
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
                </div>
                 <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="font-body">Service Address (IP/FQDN)</FormLabel>
                        <FormControl>
                            <Input {...field} className="font-body" placeholder="e.g., 1.2.3.4 or backend.example.com" />
                        </FormControl>
                        <FormDescription className="font-body text-xs">The actual address this host configuration targets or listens on.</FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                <FormField
                  control={form.control}
                  name="networkConfig"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-body">Network Configuration (JSON)</FormLabel>
                      <FormControl>
                        <Textarea {...field} className="font-mono min-h-[120px] text-xs" placeholder={defaultNetworkConfigPlaceholder} />
                      </FormControl>
                      <FormDescription className="font-body text-xs">
                        Define transport settings (e.g., WebSocket, gRPC) and camouflage (paths, headers).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="streamSecurityConfig"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-body">Stream Security Configuration (JSON)</FormLabel>
                      <FormControl>
                        <Textarea {...field} className="font-mono min-h-[120px] text-xs" placeholder={defaultStreamSecurityConfigPlaceholder} />
                      </FormControl>
                      <FormDescription className="font-body text-xs">
                        Configure TLS or REALITY settings, including SNI, ALPN, certificates.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="muxConfig"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-body">MUX Configuration (JSON)</FormLabel>
                      <FormControl>
                        <Textarea {...field} className="font-mono min-h-[80px] text-xs" placeholder={defaultMuxConfigPlaceholder} />
                      </FormControl>
                      <FormDescription className="font-body text-xs">
                        Enable and configure multiplexing (e.g., Mux.Cool for Xray).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-body">Notes</FormLabel>
                      <FormControl>
                        <Textarea {...field} className="font-body min-h-[80px]" placeholder="Optional notes about this host configuration..." />
                      </FormControl>
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
                {hostData ? "Save Changes" : "Add Host"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

    