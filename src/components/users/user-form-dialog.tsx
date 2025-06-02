
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
import type { User, UserStatus, KernelProtocol, Country } from "@/app/users/user-data";
import { userStatuses, kernels, availableCountries } from "@/app/users/user-data";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Copy, ShieldQuestion, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const tunnelServiceEnum = z.enum(['none', 'tor', 'warp', 'psiphon']);

const userFormSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters."),
  fullName: z.string().min(1, "Full name is required."),
  email: z.string().email("Invalid email address."),
  status: z.enum(userStatuses as [UserStatus, ...UserStatus[]], { required_error: "Status is required."}),
  kernelId: z.string().min(1, "Kernel is required."),
  kernelProfile: z.string().min(1, "Kernel profile name is required."),
  protocol: z.string().min(1,"Protocol is required."),
  dataAllowanceGB: z.coerce.number().min(0, "Data allowance must be a positive number."),
  dataUsedGB: z.coerce.number().min(0, "Used data must be a positive number."),
  maxConcurrentIPs: z.coerce.number().int().min(1, "Max IPs must be at least 1."),
  validityPeriodDays: z.coerce.number().int().min(1, "Validity period must be at least 1 day."),
  isEnabled: z.boolean(),
  notes: z.string().optional(),
  sublinkPath: z.string().optional(),
  enableTunnelSetup: z.boolean().optional(),
  tunnelConfig: z.object({
    service: tunnelServiceEnum,
    countries: z.array(z.string()).optional(),
    warpLicenseKey: z.string().optional(),
  }).optional(),
}).refine(data => data.dataUsedGB <= data.dataAllowanceGB, {
  message: "Used data cannot exceed data allowance.",
  path: ["dataUsedGB"],
});

type UserFormData = z.infer<typeof userFormSchema>;

interface UserFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
  userData?: User | null;
}

export function UserFormDialog({ isOpen, onClose, onSave, userData }: UserFormDialogProps) {
  const [availableProtocols, setAvailableProtocols] = React.useState<KernelProtocol[]>([]);
  const [subscriptionUrl, setSubscriptionUrl] = React.useState<string>("");
  const { toast } = useToast();
  const isNewUser = !userData;

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: userData
      ? {
          ...userData,
          notes: userData.notes || "",
          sublinkPath: userData.sublinkPath || "",
          enableTunnelSetup: userData.enableTunnelSetup || false,
          tunnelConfig: userData.tunnelConfig || { service: 'none', countries: [], warpLicenseKey: "" },
        }
      : {
          username: "",
          fullName: "",
          email: "", // Will be auto-generated
          status: "Active",
          kernelId: kernels[0]?.id || "",
          kernelProfile: kernels[0]?.name || "",
          protocol: "", 
          dataAllowanceGB: 10,
          dataUsedGB: 0,
          maxConcurrentIPs: 1,
          validityPeriodDays: 30,
          isEnabled: true,
          notes: "",
          sublinkPath: "",
          enableTunnelSetup: false,
          tunnelConfig: { service: 'none', countries: [], warpLicenseKey: "" },
        },
  });

  const selectedKernelId = form.watch("kernelId");
  const currentSublinkPath = form.watch("sublinkPath");
  const enableTunnel = form.watch("enableTunnelSetup");
  const selectedTunnelService = form.watch("tunnelConfig.service");
  const usernameValue = form.watch("username");

  React.useEffect(() => {
    if (currentSublinkPath && typeof window !== 'undefined') {
      setSubscriptionUrl(`${window.location.origin}/sub/${currentSublinkPath}`);
    } else {
      setSubscriptionUrl("");
    }
  }, [currentSublinkPath]);

  React.useEffect(() => {
    if (isNewUser && usernameValue) {
      form.setValue("email", `${usernameValue.toLowerCase().replace(/[^a-z0-9_.-]/gi, '') || 'user'}@protocolpilot.local`, { shouldValidate: false });
    }
  }, [usernameValue, isNewUser, form]);

  React.useEffect(() => {
    if (selectedKernelId) {
      const selectedKernel = kernels.find(k => k.id === selectedKernelId);
      if (selectedKernel) {
        setAvailableProtocols(selectedKernel.protocols);
        if (!userData || userData.kernelId !== selectedKernelId || !selectedKernel.protocols.find(p => p.name === form.getValues("protocol"))) {
          form.setValue("protocol", selectedKernel.protocols[0]?.name || "");
        }
        if (!userData || userData.kernelId !== selectedKernelId) {
             form.setValue("kernelProfile", selectedKernel.name); 
        }
      } else {
        setAvailableProtocols([]);
        form.setValue("protocol", "");
      }
    } else {
      setAvailableProtocols([]);
      form.setValue("protocol", "");
    }
  }, [selectedKernelId, form, userData]);

  React.useEffect(() => {
    if (isOpen) {
      if (userData) {
        form.reset({
          ...userData,
          notes: userData.notes || "",
          sublinkPath: userData.sublinkPath || "",
          enableTunnelSetup: userData.enableTunnelSetup || false,
          tunnelConfig: userData.tunnelConfig || { service: 'none', countries: [], warpLicenseKey: "" },
        });
        const initialKernel = kernels.find(k => k.id === userData.kernelId);
        setAvailableProtocols(initialKernel?.protocols || []);
      } else { // New user
        const defaultKernel = kernels[0];
        const newSublinkPath = `sub_${Math.random().toString(36).substring(2, 10)}`;
        form.reset({
          username: "",
          fullName: "",
          email: "", // Will be set by username watcher
          status: "Active",
          kernelId: defaultKernel?.id || "",
          kernelProfile: defaultKernel?.name || "",
          protocol: defaultKernel?.protocols[0]?.name || "",
          dataAllowanceGB: 10,
          dataUsedGB: 0,
          maxConcurrentIPs: 1,
          validityPeriodDays: 30,
          isEnabled: true,
          notes: "",
          sublinkPath: newSublinkPath,
          enableTunnelSetup: false,
          tunnelConfig: { service: 'none', countries: [], warpLicenseKey: "" },
        });
        setAvailableProtocols(defaultKernel?.protocols || []);
        // Initial email set if username is empty
        if (!form.getValues("username")) {
          form.setValue("email", `user@protocolpilot.local`);
        }
      }
    }
  }, [userData, form, isOpen]);

  React.useEffect(() => {
    if (!enableTunnel) {
      form.setValue("tunnelConfig.service", "none");
      form.setValue("tunnelConfig.countries", []);
      form.setValue("tunnelConfig.warpLicenseKey", "");
    }
  }, [enableTunnel, form]);

  const onSubmit = (data: UserFormData) => {
    let dataToSave: User = {
      ...(userData || { id: "", createdAt: new Date().toISOString() }),
      ...data,
      enableTunnelSetup: data.enableTunnelSetup || false,
      tunnelConfig: data.enableTunnelSetup ? data.tunnelConfig : { service: 'none'},
    };

    if (!userData && !dataToSave.sublinkPath) { 
      dataToSave.sublinkPath = `sub_${data.username.toLowerCase().replace(/[^a-z0-9]/gi, '')}_${Math.random().toString(36).substring(2, 8)}`;
    }
    
    onSave(dataToSave);
  };

  const handleCopySubscriptionUrl = () => {
    if (subscriptionUrl) {
      navigator.clipboard.writeText(subscriptionUrl)
        .then(() => {
          toast({ title: "Copied!", description: "Subscription URL copied to clipboard." });
        })
        .catch(err => {
          toast({ variant: "destructive", title: "Copy Failed", description: "Could not copy URL." });
        });
    }
  };

  const handleMockValidateWarpLicense = () => {
    const key = form.getValues("tunnelConfig.warpLicenseKey");
    if (key && key.toLowerCase().includes("valid")) {
      toast({ title: "License Validated (Mock)", description: "Warp license key appears valid."});
    } else {
      toast({ variant: "destructive", title: "License Invalid (Mock)", description: "Warp license key appears invalid."});
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="font-headline">
            {userData ? "Edit User" : "Add New User"}
          </DialogTitle>
          <DialogDescription className="font-body">
            {userData ? "Update the details for this user." : "Fill in the details for the new user."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <ScrollArea className="h-[70vh] pr-6">
              <div className="space-y-6 py-1">
                {/* Basic Info */}
                <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="font-headline text-lg">Basic Information</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="username" render={({ field }) => (<FormItem><FormLabel className="font-body">Username</FormLabel><FormControl><Input {...field} className="font-body" /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="fullName" render={({ field }) => (<FormItem><FormLabel className="font-body">Full Name</FormLabel><FormControl><Input {...field} className="font-body" /></FormControl><FormMessage /></FormItem>)} />
                      </div>
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-body">Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                {...field}
                                className="font-body"
                                readOnly={isNewUser}
                                placeholder={isNewUser ? "Auto-generated from username" : "user@example.com"}
                              />
                            </FormControl>
                            {isNewUser && <FormDescription className="font-body text-xs">Email is auto-generated from username and non-editable for new users.</FormDescription>}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                     <AccordionTrigger className="font-headline text-lg">Service & Data Configuration</AccordionTrigger>
                     <AccordionContent className="space-y-4 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField control={form.control} name="kernelId" render={({ field }) => (
                              <FormItem>
                                <FormLabel className="font-body">Kernel</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl><SelectTrigger className="font-body"><SelectValue placeholder="Select kernel" /></SelectTrigger></FormControl>
                                  <SelectContent>{kernels.map((kernel) => (<SelectItem key={kernel.id} value={kernel.id} className="font-body">{kernel.name}</SelectItem>))}</SelectContent>
                                </Select><FormMessage />
                              </FormItem> )} />
                          <FormField control={form.control} name="protocol" render={({ field }) => (
                              <FormItem>
                                <FormLabel className="font-body">Protocol</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value} disabled={availableProtocols.length === 0}>
                                  <FormControl><SelectTrigger className="font-body"><SelectValue placeholder="Select protocol" /></SelectTrigger></FormControl>
                                  <SelectContent>{availableProtocols.map((protocol) => (<SelectItem key={protocol.name} value={protocol.name} className="font-body">{protocol.label}</SelectItem>))}</SelectContent>
                                </Select><FormMessage />
                              </FormItem> )} />
                        </div>
                        <FormField control={form.control} name="kernelProfile" render={({ field }) => (<FormItem><FormLabel className="font-body">Kernel Profile Name</FormLabel><FormControl><Input {...field} className="font-body" placeholder="e.g., Xray VLESS Standard"/></FormControl><FormDescription>A descriptive name for this configuration.</FormDescription><FormMessage /></FormItem>)} />
                        {currentSublinkPath && (<FormItem><FormLabel className="font-body">Subscription URL</FormLabel><div className="flex items-center gap-2"><Input readOnly value={subscriptionUrl} className="font-body bg-muted" placeholder="Generating URL..." /><Button type="button" variant="outline" size="icon" onClick={handleCopySubscriptionUrl} disabled={!subscriptionUrl}><Copy className="h-4 w-4" /></Button></div><FormDescription>Unique URL for this user's subscription page.</FormDescription></FormItem>)}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField control={form.control} name="dataAllowanceGB" render={({ field }) => (<FormItem><FormLabel className="font-body">Data Allowance (GB)</FormLabel><FormControl><Input type="number" {...field} className="font-body" /></FormControl><FormMessage /></FormItem>)} />
                          <FormField control={form.control} name="dataUsedGB" render={({ field }) => (<FormItem><FormLabel className="font-body">Data Used (GB)</FormLabel><FormControl><Input type="number" {...field} className="font-body" /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField control={form.control} name="maxConcurrentIPs" render={({ field }) => (<FormItem><FormLabel className="font-body">Max Concurrent IPs</FormLabel><FormControl><Input type="number" {...field} className="font-body" /></FormControl><FormMessage /></FormItem>)} />
                          <FormField control={form.control} name="validityPeriodDays" render={({ field }) => (<FormItem><FormLabel className="font-body">Validity (Days)</FormLabel><FormControl><Input type="number" {...field} className="font-body" /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                     </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger className="font-headline text-lg">Account Status & Notes</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField control={form.control} name="status" render={({ field }) => (
                              <FormItem>
                                <FormLabel className="font-body">Account Status</FormLabel>
                                <Select onValueChange={(value) => field.onChange(value as UserStatus)} defaultValue={field.value}>
                                  <FormControl><SelectTrigger id="status" className="font-body"><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                                  <SelectContent>{userStatuses.map((status) => (<SelectItem key={status} value={status} className="font-body">{status}</SelectItem>))}</SelectContent>
                                </Select><FormMessage />
                              </FormItem> )} />
                          <FormField control={form.control} name="isEnabled" render={({ field }) => (
                              <FormItem className="flex flex-col justify-end">
                                <FormLabel className="font-body invisible">Enable User Label</FormLabel>
                                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm h-[40px]">
                                  <FormLabel htmlFor="isEnabledSwitch" className="font-body text-sm">User Enabled</FormLabel>
                                  <FormControl><Switch id="isEnabledSwitch" checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                </div><FormMessage />
                              </FormItem> )} />
                        </div>
                        <FormField control={form.control} name="notes" render={({ field }) => (<FormItem><FormLabel className="font-body">Notes</FormLabel><FormControl><Textarea {...field} className="font-body min-h-[80px]" /></FormControl><FormMessage /></FormItem>)} />
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-4">
                    <AccordionTrigger className="font-headline text-lg flex items-center justify-between w-full">
                        <span>Advanced Tunnel Configuration</span>
                        <FormField
                            control={form.control}
                            name="enableTunnelSetup"
                            render={({ field }) => (
                                <FormItem onClick={(e) => e.stopPropagation()} className="flex items-center space-x-2 ml-auto mr-2">
                                     <Switch
                                        id="enableTunnelSwitch"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                    <FormLabel htmlFor="enableTunnelSwitch" className="font-body text-sm cursor-pointer">
                                        Enable
                                    </FormLabel>
                                </FormItem>
                            )}
                        />
                    </AccordionTrigger>
                    <AccordionContent className={cn("space-y-6 pt-4", !enableTunnel && "hidden")}>
                        <FormField
                            control={form.control}
                            name="tunnelConfig.service"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                <FormLabel className="font-body">Tunnel Service</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                    onValueChange={(value) => {
                                        field.onChange(value as UserFormData['tunnelConfig']['service']);
                                        if (value !== 'warp') form.setValue('tunnelConfig.warpLicenseKey', '');
                                        if (value !== 'tor' && value !== 'psiphon') form.setValue('tunnelConfig.countries', []);
                                    }}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-1"
                                    >
                                    {['none', 'tor', 'warp', 'psiphon'].map((service) => (
                                        <FormItem key={service} className="flex items-center space-x-3 space-y-0">
                                            <FormControl><RadioGroupItem value={service} /></FormControl>
                                            <FormLabel className="font-normal font-body capitalize">{service}</FormLabel>
                                        </FormItem>
                                    ))}
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                        {selectedTunnelService === 'warp' && (
                            <FormField
                                control={form.control}
                                name="tunnelConfig.warpLicenseKey"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-body">Warp License Key</FormLabel>
                                    <div className="flex items-center gap-2">
                                        <FormControl><Input {...field} className="font-body" placeholder="Enter Warp License" /></FormControl>
                                        <Button type="button" variant="outline" onClick={handleMockValidateWarpLicense} size="sm" className="font-body"><ShieldQuestion className="mr-1.5 h-4 w-4" /> Validate</Button>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        )}

                        {(selectedTunnelService === 'tor' || selectedTunnelService === 'psiphon') && (
                            <FormField
                                control={form.control}
                                name="tunnelConfig.countries"
                                render={() => (
                                <FormItem>
                                    <div className="mb-4">
                                        <FormLabel className="text-base font-body">Select Countries for {selectedTunnelService?.toUpperCase()}</FormLabel>
                                        <FormDescription className="font-body">
                                            Choose exit nodes or preferred countries for the selected tunnel service.
                                        </FormDescription>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 max-h-48 overflow-y-auto border p-3 rounded-md">
                                    {availableCountries.map((country) => (
                                        <FormField
                                            key={country.code}
                                            control={form.control}
                                            name="tunnelConfig.countries"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <Checkbox
                                                    checked={field.value?.includes(country.code)}
                                                    onCheckedChange={(checked) => {
                                                        return checked
                                                        ? field.onChange([...(field.value || []), country.code])
                                                        : field.onChange(
                                                            (field.value || []).filter(
                                                                (value) => value !== country.code
                                                            )
                                                            );
                                                    }}
                                                    />
                                                </FormControl>
                                                <FormLabel className="text-sm font-normal font-body">
                                                    {country.flag} {country.name}
                                                </FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                    ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
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
        </Form>
      </DialogContent>
    </Dialog>
  );
}
