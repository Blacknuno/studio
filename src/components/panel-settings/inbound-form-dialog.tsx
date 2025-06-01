
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { XrayInboundSetting } from "@/app/users/user-data";

const xrayProtocols = ["vless", "vmess", "trojan", "shadowsocks", "http", "socks"] as const;

const inboundFormSchema = z.object({
  tag: z.string().min(1, "Tag is required."),
  port: z.coerce.number().min(1, "Port must be a positive number.").max(65535, "Port must be less than 65536."),
  protocol: z.enum(xrayProtocols, { required_error: "Protocol is required."}),
  settings: z.string().refine((val) => {
    try { JSON.parse(val); return true; } catch { return false; }
  }, { message: "Invalid JSON format for settings." }),
  streamSettings: z.string().refine((val) => {
    try { JSON.parse(val); return true; } catch { return false; }
  }, { message: "Invalid JSON format for stream settings." }),
  isEnabled: z.boolean(),
});

type InboundFormData = z.infer<typeof inboundFormSchema>;

interface InboundFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: XrayInboundSetting) => void;
  inboundData?: XrayInboundSetting | null;
}

const defaultSettingsPlaceholder = `{
  "clients": [],
  "decryption": "none"
  // Add Mux settings here if needed, e.g.:
  // "mux": { "enabled": true, "concurrency": 8 }
}`;

const defaultStreamSettingsPlaceholder = `{
  "network": "ws",
  "security": "tls",
  "tlsSettings": {
    "serverName": "yourdomain.com" // For SNI, essential for camouflage
    // "certificates": [{ "certificateFile": "/path/to/cert.pem", "keyFile": "/path/to/key.pem" }]
  },
  "wsSettings": {
    "path": "/vless", // Camouflage path
    "headers": {
      "Host": "yourdomain.com" // Host header for camouflage
    }
  }
  // Add other network settings (tcp, kcp, grpc, etc.) or security enhancements here.
}`;

export function InboundFormDialog({ isOpen, onClose, onSave, inboundData }: InboundFormDialogProps) {
  const form = useForm<InboundFormData>({
    resolver: zodResolver(inboundFormSchema),
    defaultValues: inboundData
      ? { ...inboundData }
      : {
          tag: "",
          port: 0,
          protocol: "vless",
          settings: JSON.stringify({ clients: [], decryption: "none" }, null, 2),
          streamSettings: JSON.stringify({ network: "ws", security: "tls", wsSettings: { path: "/example", headers: { "Host": "example.com" } }, tlsSettings: {"serverName": "example.com"}}, null, 2),
          isEnabled: true,
        },
  });

  React.useEffect(() => {
    if (isOpen) {
      if (inboundData) {
        form.reset(inboundData);
      } else {
        form.reset({
          tag: "",
          port: Math.floor(Math.random() * (49151 - 1024 + 1)) + 1024, // Random default port
          protocol: "vless",
          settings: defaultSettingsPlaceholder,
          streamSettings: defaultStreamSettingsPlaceholder,
          isEnabled: true,
        });
      }
    }
  }, [inboundData, form, isOpen]);

  const onSubmit = (data: InboundFormData) => {
    const dataToSave: XrayInboundSetting = {
      ...(inboundData || { id: "" }), 
      ...data,
    };
    onSave(dataToSave);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="font-headline">
            {inboundData ? "Edit Xray Inbound" : "Add New Xray Inbound"}
          </DialogTitle>
          <DialogDescription className="font-body">
            Configure the details for the Xray-core inbound connection. Use the JSON fields for advanced settings.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <ScrollArea className="h-[65vh] pr-6">
              <div className="space-y-4 py-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tag"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-body">Tag</FormLabel>
                        <FormControl>
                          <Input {...field} className="font-body" placeholder="e.g., vless-inbound" />
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
                        <FormDescription className="font-body text-xs">
                          Suggested high-speed ports: 443, 8443, 2053, 2083, 2087, 2096.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="protocol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-body">Protocol</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="font-body">
                            <SelectValue placeholder="Select protocol" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {xrayProtocols.map((proto) => (
                            <SelectItem key={proto} value={proto} className="font-body">
                              {proto.toUpperCase()}
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
                  name="settings"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-body">Settings (JSON)</FormLabel>
                      <FormControl>
                        <Textarea {...field} className="font-mono min-h-[120px] text-xs" placeholder={defaultSettingsPlaceholder} />
                      </FormControl>
                      <FormDescription className="font-body text-xs">
                        Enter protocol-specific settings as valid JSON (e.g., client configurations, Mux settings).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="streamSettings"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-body">Stream Settings (JSON)</FormLabel>
                      <FormControl>
                        <Textarea {...field} className="font-mono min-h-[120px] text-xs" placeholder={defaultStreamSettingsPlaceholder}/>
                      </FormControl>
                      <FormDescription className="font-body text-xs">
                        Configure transport settings (network, security like TLS, camouflage like WebSocket path/Host header, SNI in tlsSettings.serverName) as valid JSON.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isEnabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel className="font-body">Enable Inbound</FormLabel>
                        <FormDescription className="font-body text-xs">
                          Whether this inbound connection is active.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
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
                {inboundData ? "Save Changes" : "Create Inbound"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

