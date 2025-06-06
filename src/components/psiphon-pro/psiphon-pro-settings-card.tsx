
"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { kernels, availableCountries, type PsiphonProConfig, defaultInitialPanelSettings } from "@/app/users/user-data"; // Added defaultInitialPanelSettings
import { Route, Save, Settings, Globe, Gauge, Server, RotateCcw } from "lucide-react";

const psiphonKernel = kernels.find(k => k.id === 'psiphon-pro');

const psiphonSettingsSchema = z.object({
  ports: z.string().transform(val => val.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n) && n > 0 && n <= 65535)),
  transportMode: z.enum(['SSH', 'OBFUSCATED_SSH', 'HTTP_PROXY']),
  enableCountrySelection: z.boolean(),
  selectedCountries: z.array(z.string()),
  customServerList: z.string().optional(),
  bandwidthLimitMbps: z.coerce.number().min(0).optional(), 
});

type PsiphonSettingsFormData = z.infer<typeof psiphonSettingsSchema>;

export function PsiphonProSettingsCard() {
  const { toast } = useToast();
  
  // Local state for the form, initialized from the Psiphon kernel's config
  const [currentKernelConfig, setCurrentKernelConfig] = React.useState<PsiphonProConfig | null>(
    psiphonKernel?.config && 'ports' in psiphonKernel.config ? psiphonKernel.config as PsiphonProConfig : null
  );

  const form = useForm<PsiphonSettingsFormData>({
    resolver: zodResolver(psiphonSettingsSchema),
    defaultValues: {
      ports: currentKernelConfig?.ports?.join(", ") || "1080, 8081",
      transportMode: currentKernelConfig?.transportMode || 'OBFUSCATED_SSH',
      enableCountrySelection: currentKernelConfig?.enableCountrySelection || true,
      selectedCountries: currentKernelConfig?.selectedCountries || ["CA", "DE"],
      customServerList: currentKernelConfig?.customServerList || "",
      bandwidthLimitMbps: currentKernelConfig?.bandwidthLimitMbps || 0,
    },
  });

  // Effect to update form if the kernel config changes globally (e.g. after a reset)
  React.useEffect(() => {
    const updatedKernelConf = kernels.find(k => k.id === 'psiphon-pro')?.config as PsiphonProConfig | undefined;
    setCurrentKernelConfig(updatedKernelConf || null);
    if (updatedKernelConf) {
      form.reset({
        ports: updatedKernelConf.ports.join(", "),
        transportMode: updatedKernelConf.transportMode,
        enableCountrySelection: updatedKernelConf.enableCountrySelection,
        selectedCountries: updatedKernelConf.selectedCountries,
        customServerList: updatedKernelConf.customServerList || "",
        bandwidthLimitMbps: updatedKernelConf.bandwidthLimitMbps || 0,
      });
    }
  }, [kernels, form]); // Dependency on the global kernels array

  const onSubmit = (data: PsiphonSettingsFormData) => {
    if (psiphonKernel) {
      const psiphonKernelIndex = kernels.findIndex(k => k.id === 'psiphon-pro');
      if (psiphonKernelIndex !== -1) {
        const currentConf = kernels[psiphonKernelIndex].config as PsiphonProConfig;
        kernels[psiphonKernelIndex].config = {
          ...currentConf,
          ports: data.ports,
          transportMode: data.transportMode,
          enableCountrySelection: data.enableCountrySelection,
          selectedCountries: data.selectedCountries,
          customServerList: data.customServerList,
          bandwidthLimitMbps: data.bandwidthLimitMbps,
        };
        setCurrentKernelConfig(kernels[psiphonKernelIndex].config as PsiphonProConfig); // Update local state
      }
      
      toast({
        title: "Psiphon Pro Settings Saved",
        description: "Your Psiphon Pro configurations have been (mock) saved.",
      });
    } else {
       toast({
        title: "Error",
        description: "Psiphon Pro kernel configuration not found.",
        variant: "destructive",
      });
    }
  };

  const handleResetToDefaults = () => {
    if (psiphonKernel) {
        // Assuming default Psiphon config is stored similarly or define it here
        const defaultPsiphonConfig = (defaultInitialPanelSettings.kernelsConfig?.psiphonPro as PsiphonProConfig | undefined) 
                                     || { ports: [1080, 8081], transportMode: 'OBFUSCATED_SSH', enableCountrySelection: true, selectedCountries: ["CA", "DE"], customServerList: "", bandwidthLimitMbps: 0 };
        
        const psiphonKernelIndex = kernels.findIndex(k => k.id === 'psiphon-pro');
        if (psiphonKernelIndex !== -1) {
            kernels[psiphonKernelIndex].config = JSON.parse(JSON.stringify(defaultPsiphonConfig));
            setCurrentKernelConfig(kernels[psiphonKernelIndex].config as PsiphonProConfig); // Update local state
        }

        form.reset({
            ports: defaultPsiphonConfig.ports.join(", "),
            transportMode: defaultPsiphonConfig.transportMode,
            enableCountrySelection: defaultPsiphonConfig.enableCountrySelection,
            selectedCountries: defaultPsiphonConfig.selectedCountries,
            customServerList: defaultPsiphonConfig.customServerList || "",
            bandwidthLimitMbps: defaultPsiphonConfig.bandwidthLimitMbps || 0,
        });
        
        toast({
          title: "Psiphon Pro Settings Reset",
          description: "Psiphon Pro configurations have been reset to defaults (mocked).",
          variant: "default"
        });
    }
  };

  if (!psiphonKernel || !currentKernelConfig) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center"><Route className="mr-2 h-6 w-6 text-primary" /> Psiphon Pro Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Psiphon Pro kernel or its configuration not found in the system.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center"><Settings className="mr-2 h-6 w-6 text-primary" /> Psiphon Pro Service Configuration</CardTitle>
        <CardDescription className="font-body">
          Adjust detailed settings for the Psiphon Pro service.
        </CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="psiphonPorts" className="font-body flex items-center"><Server className="mr-2 h-4 w-4 text-muted-foreground"/>Listening Ports</Label>
              <Input
                id="psiphonPorts"
                {...form.register("ports")}
                placeholder="e.g., 1080, 8081"
                className="font-body mt-1"
              />
              {form.formState.errors.ports && <p className="text-sm text-destructive mt-1">{form.formState.errors.ports.message}</p>}
              <p className="text-xs text-muted-foreground font-body mt-1">Comma-separated list of ports.</p>
            </div>
            <div>
              <Label htmlFor="psiphonTransportMode" className="font-body flex items-center"><Route className="mr-2 h-4 w-4 text-muted-foreground"/>Transport Mode</Label>
              <Controller
                name="transportMode"
                control={form.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger id="psiphonTransportMode" className="font-body mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SSH">SSH</SelectItem>
                      <SelectItem value="OBFUSCATED_SSH">Obfuscated SSH</SelectItem>
                      <SelectItem value="HTTP_PROXY">HTTP Proxy</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
               <p className="text-xs text-muted-foreground font-body mt-1">Select the primary transport protocol.</p>
            </div>
          </div>

           <div>
              <Label htmlFor="bandwidthLimitMbps" className="font-body flex items-center"><Gauge className="mr-2 h-4 w-4 text-muted-foreground"/>Bandwidth Limit (Mbps)</Label>
              <Input
                id="bandwidthLimitMbps"
                type="number"
                {...form.register("bandwidthLimitMbps")}
                placeholder="0 for unlimited"
                className="font-body mt-1"
              />
              {form.formState.errors.bandwidthLimitMbps && <p className="text-sm text-destructive mt-1">{form.formState.errors.bandwidthLimitMbps.message}</p>}
               <p className="text-xs text-muted-foreground font-body mt-1">Set max bandwidth per user/connection (0 for unlimited).</p>
            </div>


          <div className="space-y-2 pt-4 border-t">
            <h3 className="font-headline text-md flex items-center"><Globe className="mr-2 h-5 w-5 text-muted-foreground"/>Geo-Targeting</h3>
            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <Label htmlFor="enablePsiphonCountrySelection" className="font-body">Enable Exit Country Selection</Label>
              <Controller
                name="enableCountrySelection"
                control={form.control}
                render={({ field }) => (
                  <Checkbox
                    id="enablePsiphonCountrySelection"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>

            {form.watch("enableCountrySelection") && (
              <div>
                <Label className="font-body">Select Preferred Exit Countries</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 border rounded-md max-h-48 overflow-y-auto mt-1">
                  {availableCountries.map(country => (
                    <Controller
                      key={`psiphon-country-${country.code}`}
                      name="selectedCountries"
                      control={form.control}
                      render={({ field }) => (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`psiphon-country-${country.code}`}
                            checked={field.value?.includes(country.code)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...(field.value || []), country.code])
                                : field.onChange((field.value || []).filter((value) => value !== country.code));
                            }}
                          />
                          <Label htmlFor={`psiphon-country-${country.code}`} className="font-normal font-body">{country.flag} {country.name}</Label>
                        </div>
                      )}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
           <div>
              <Label htmlFor="customServerList" className="font-body">Custom Server List URL (Optional)</Label>
              <Input
                id="customServerList"
                {...form.register("customServerList")}
                placeholder="https://example.com/serverlist.txt"
                className="font-body mt-1"
              />
              {form.formState.errors.customServerList && <p className="text-sm text-destructive mt-1">{form.formState.errors.customServerList.message}</p>}
            </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
            <Button onClick={handleResetToDefaults} variant="outline" className="font-body">
                <RotateCcw className="mr-2 h-4 w-4" /> Reset to Defaults
            </Button>
            <Button type="submit" className="font-body">
                <Save className="mr-2 h-4 w-4" /> Save Settings
            </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
