
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
import { useToast } from "@/hooks/use-toast";
import { kernels, availableCountries, type TorWarpFakeSiteConfig, initialPanelSettings } from "@/app/users/user-data";
import { Route, Info, Save } from "lucide-react";

const torKernel = kernels.find(k => k.id === 'tor-service');

const torSettingsSchema = z.object({
  isEnabled: z.boolean(),
  ports: z.string().transform(val => val.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n) && n > 0 && n <= 65535)),
  fakeDomain: z.string().min(3, "Fake domain must be at least 3 characters."),
  enableCountrySelection: z.boolean(),
  selectedCountries: z.array(z.string()),
});

type TorSettingsFormData = z.infer<typeof torSettingsSchema>;

export function TorServiceTab() {
  const { toast } = useToast();
  const [torServiceData, setTorServiceData] = React.useState(initialPanelSettings.torServicePanel);
  const [kernelConfig, setKernelConfig] = React.useState<TorWarpFakeSiteConfig | null>(
    torKernel?.config && 'ports' in torKernel.config ? torKernel.config as TorWarpFakeSiteConfig : null
  );

  const form = useForm<TorSettingsFormData>({
    resolver: zodResolver(torSettingsSchema),
    defaultValues: {
      isEnabled: torServiceData.isEnabled,
      ports: kernelConfig?.ports?.join(", ") || "9050, 9150",
      fakeDomain: kernelConfig?.fakeDomain || "www.bing.com",
      enableCountrySelection: kernelConfig?.enableCountrySelection || true,
      selectedCountries: kernelConfig?.selectedCountries || ["US", "NL"],
    },
  });

  React.useEffect(() => {
    if (kernelConfig) {
      form.reset({
        isEnabled: torServiceData.isEnabled,
        ports: kernelConfig.ports.join(", "),
        fakeDomain: kernelConfig.fakeDomain,
        enableCountrySelection: kernelConfig.enableCountrySelection,
        selectedCountries: kernelConfig.selectedCountries,
      });
    }
  }, [kernelConfig, torServiceData.isEnabled, form]);


  const onSubmit = (data: TorSettingsFormData) => {
    // Mock saving panel-level Tor service toggle
    initialPanelSettings.torServicePanel.isEnabled = data.isEnabled;
    setTorServiceData({ isEnabled: data.isEnabled });

    // Mock saving kernel config changes
    if (torKernel && kernelConfig) {
      const updatedKernelConfig: TorWarpFakeSiteConfig = {
        ...kernelConfig,
        ports: data.ports,
        fakeDomain: data.fakeDomain,
        enableCountrySelection: data.enableCountrySelection,
        selectedCountries: data.selectedCountries,
      };
      // In a real app, you would find the kernel in the main kernels array and update its config
      // For mock, we can update the local state `kernelConfig` which is derived from kernels
      const torKernelIndex = kernels.findIndex(k => k.id === 'tor-service');
      if (torKernelIndex !== -1) {
        kernels[torKernelIndex].config = updatedKernelConfig;
      }
      setKernelConfig(updatedKernelConfig); // Update local state for UI
    }
    
    toast({
      title: "Tor Service Settings Saved",
      description: "Your Tor service configurations have been (mock) saved.",
    });
  };

  if (!torKernel || !kernelConfig) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center"><Route className="mr-2 h-6 w-6 text-primary" /> Tor Service</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Tor service kernel configuration not found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center"><Route className="mr-2 h-6 w-6 text-primary" /> Tor Service Management</CardTitle>
        <CardDescription className="font-body">
          Configure the Tor service. Traffic will be routed through the Tor network, optionally using a fake domain for SNI camouflage and specific exit nodes.
        </CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <Label htmlFor="enableTorService" className="text-base font-body">Enable Tor Service</Label>
              <p className="text-sm text-muted-foreground font-body">
                Master toggle for the Tor proxy service.
              </p>
            </div>
            <Controller
              name="isEnabled"
              control={form.control}
              render={({ field }) => (
                <Switch
                  id="enableTorService"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>

          {form.watch("isEnabled") && (
            <div className="space-y-4 pt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="torPorts" className="font-body">Listening Ports (comma-separated)</Label>
                  <Input
                    id="torPorts"
                    {...form.register("ports")}
                    placeholder="e.g., 9050, 9150"
                    className="font-body mt-1"
                  />
                  {form.formState.errors.ports && <p className="text-sm text-destructive mt-1">{form.formState.errors.ports.message}</p>}
                </div>
                <div>
                  <Label htmlFor="torFakeDomain" className="font-body">Fake Domain (for SNI)</Label>
                  <Input
                    id="torFakeDomain"
                    {...form.register("fakeDomain")}
                    placeholder="e.g., www.bing.com"
                    className="font-body mt-1"
                  />
                  {form.formState.errors.fakeDomain && <p className="text-sm text-destructive mt-1">{form.formState.errors.fakeDomain.message}</p>}
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                 <Label htmlFor="enableTorCountrySelection" className="font-body">Enable Exit Country Selection</Label>
                <Controller
                  name="enableCountrySelection"
                  control={form.control}
                  render={({ field }) => (
                    <Checkbox
                      id="enableTorCountrySelection"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>

              {form.watch("enableCountrySelection") && (
                <div>
                  <Label className="font-body">Select Exit Countries</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 border rounded-md max-h-48 overflow-y-auto mt-1">
                    {availableCountries.map(country => (
                      <Controller
                        key={country.code}
                        name="selectedCountries"
                        control={form.control}
                        render={({ field }) => (
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`tor-country-${country.code}`}
                              checked={field.value?.includes(country.code)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), country.code])
                                  : field.onChange((field.value || []).filter((value) => value !== country.code));
                              }}
                            />
                            <Label htmlFor={`tor-country-${country.code}`} className="font-normal font-body">{country.flag} {country.name}</Label>
                          </div>
                        )}
                      />
                    ))}
                  </div>
                </div>
              )}
               <p className="text-xs text-muted-foreground font-body flex items-center gap-1">
                <Info size={14}/> Tor service status ({torKernel.status}), data usage, and active connections are viewable on the Kernels page under "{torKernel.name}".
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="font-body">
            <Save className="mr-2 h-4 w-4" /> Save Tor Settings
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
