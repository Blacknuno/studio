
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
import { kernels, availableCountries, type TorKernelConfig, initialPanelSettings, defaultInitialPanelSettings } from "@/app/users/user-data";
import { Route, Info, Save, RotateCcw } from "lucide-react";

const torKernel = kernels.find(k => k.id === 'tor-service');

const torSettingsSchema = z.object({
  isEnabledPanel: z.boolean(), // For the panel-level toggle
  ports: z.string().transform(val => val.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n) && n > 0 && n <= 65535)),
  fakeDomain: z.string().min(3, "Fake domain must be at least 3 characters."),
  enableCountrySelectionKernel: z.boolean(), // For the kernel-level config
  selectedCountriesKernel: z.array(z.string()), // For the kernel-level config
});

type TorSettingsFormData = z.infer<typeof torSettingsSchema>;

export function TorServiceTab() {
  const { toast } = useToast();
  
  // State for panel-level toggle, kernel config is separate
  const [panelIsEnabled, setPanelIsEnabled] = React.useState(initialPanelSettings.torServicePanel.isEnabled);
  
  // State for kernel config part of the form
  const [kernelConfig, setKernelConfig] = React.useState<TorKernelConfig | null>(
    torKernel?.config && 'ports' in torKernel.config ? torKernel.config as TorKernelConfig : null
  );

  const form = useForm<TorSettingsFormData>({
    resolver: zodResolver(torSettingsSchema),
    // Default values for the form
    defaultValues: {
      isEnabledPanel: panelIsEnabled,
      ports: kernelConfig?.ports?.join(", ") || "9050, 9150",
      fakeDomain: kernelConfig?.fakeDomain || "www.bing.com",
      enableCountrySelectionKernel: kernelConfig?.enableCountrySelection || true,
      selectedCountriesKernel: kernelConfig?.selectedCountries || ["US", "NL"],
    },
  });

  // Effect to update form when global mock settings change or kernelConfig changes
  React.useEffect(() => {
    setPanelIsEnabled(initialPanelSettings.torServicePanel.isEnabled); // Sync panel toggle
    const currentKernelConf = kernels.find(k => k.id === 'tor-service')?.config as TorKernelConfig | undefined;
    setKernelConfig(currentKernelConf || null); // Sync kernel config

    form.reset({
      isEnabledPanel: initialPanelSettings.torServicePanel.isEnabled,
      ports: currentKernelConf?.ports?.join(", ") || "9050, 9150",
      fakeDomain: currentKernelConf?.fakeDomain || "www.bing.com",
      enableCountrySelectionKernel: currentKernelConf?.enableCountrySelection ?? true,
      selectedCountriesKernel: currentKernelConf?.selectedCountries || ["US", "NL"],
    });
  }, [initialPanelSettings.torServicePanel.isEnabled, kernels, form]);


  const onSubmit = (data: TorSettingsFormData) => {
    // Update panel-level Tor service toggle in global mock settings
    initialPanelSettings.torServicePanel.isEnabled = data.isEnabledPanel;
    setPanelIsEnabled(data.isEnabledPanel); // Update local state for UI consistency

    // Update kernel config in global mock settings
    if (torKernel) {
      const torKernelIndex = kernels.findIndex(k => k.id === 'tor-service');
      if (torKernelIndex !== -1) {
        const currentConf = kernels[torKernelIndex].config as TorKernelConfig;
        kernels[torKernelIndex].config = {
          ...currentConf,
          ports: data.ports,
          fakeDomain: data.fakeDomain,
          enableCountrySelection: data.enableCountrySelectionKernel,
          selectedCountries: data.selectedCountriesKernel,
        };
        // Update local state for kernelConfig to re-render if necessary
        setKernelConfig(kernels[torKernelIndex].config as TorKernelConfig);
      }
    }
    
    toast({
      title: "Tor Service Settings Saved",
      description: "Your Tor service configurations have been (mock) saved.",
    });
  };
  
  const handleResetToDefaults = () => {
    // Reset panel toggle
    setPanelIsEnabled(defaultInitialPanelSettings.torServicePanel.isEnabled);
    initialPanelSettings.torServicePanel.isEnabled = defaultInitialPanelSettings.torServicePanel.isEnabled;

    // Reset kernel config
    if (torKernel) {
        const defaultKernelConf = defaultInitialPanelSettings.kernelsConfig?.torService as TorKernelConfig | undefined // Assume defaults are stored elsewhere or use fixed values
                                || { ports: [9050, 9150], fakeDomain: "www.bing.com", enableCountrySelection: true, selectedCountries: ["US", "NL"] };

        const torKernelIndex = kernels.findIndex(k => k.id === 'tor-service');
        if (torKernelIndex !== -1) {
            kernels[torKernelIndex].config = JSON.parse(JSON.stringify(defaultKernelConf)); // Deep copy
            setKernelConfig(kernels[torKernelIndex].config as TorKernelConfig); // Update local state
        }
        
        form.reset({
            isEnabledPanel: defaultInitialPanelSettings.torServicePanel.isEnabled,
            ports: defaultKernelConf.ports.join(", "),
            fakeDomain: defaultKernelConf.fakeDomain,
            enableCountrySelectionKernel: defaultKernelConf.enableCountrySelection,
            selectedCountriesKernel: defaultKernelConf.selectedCountries,
        });
    }

    toast({
      title: "Tor Service Settings Reset",
      description: "Tor service configurations have been reset to defaults (mocked).",
      variant: "default"
    });
  };


  if (!torKernel || !kernelConfig) { // Check kernelConfig as well
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
              <Label htmlFor="enableTorServicePanel" className="text-base font-body">Enable Tor Service (Panel Toggle)</Label>
              <p className="text-sm text-muted-foreground font-body">
                Master toggle for enabling/disabling Tor features in the panel.
              </p>
            </div>
            <Controller
              name="isEnabledPanel"
              control={form.control}
              render={({ field }) => (
                <Switch
                  id="enableTorServicePanel"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>

          {form.watch("isEnabledPanel") && ( // Show kernel settings only if panel toggle is on
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
                 <Label htmlFor="enableTorCountrySelectionKernel" className="font-body">Enable Exit Country Selection (Kernel)</Label>
                <Controller
                  name="enableCountrySelectionKernel"
                  control={form.control}
                  render={({ field }) => (
                    <Checkbox
                      id="enableTorCountrySelectionKernel"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>

              {form.watch("enableCountrySelectionKernel") && (
                <div>
                  <Label className="font-body">Select Exit Countries (Kernel)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 border rounded-md max-h-48 overflow-y-auto mt-1">
                    {availableCountries.map(country => (
                      <Controller
                        key={country.code}
                        name="selectedCountriesKernel"
                        control={form.control}
                        render={({ field }) => (
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`tor-kernel-country-${country.code}`}
                              checked={field.value?.includes(country.code)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), country.code])
                                  : field.onChange((field.value || []).filter((value) => value !== country.code));
                              }}
                            />
                            <Label htmlFor={`tor-kernel-country-${country.code}`} className="font-normal font-body">{country.flag} {country.name}</Label>
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
        <CardFooter className="flex justify-end gap-2">
           <Button type="button" onClick={handleResetToDefaults} variant="outline" className="font-body">
              <RotateCcw className="mr-2 h-4 w-4" /> Reset to Defaults
            </Button>
          <Button type="submit" className="font-body">
            <Save className="mr-2 h-4 w-4" /> Save Tor Settings
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
