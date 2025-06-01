
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { kernels, type Kernel, type XrayConfig, type OpenVPNConfig, type WireGuardConfig, type SingBoxConfig, type TorWarpFakeSiteConfig, type PsiphonProConfig, availableCountries } from '@/app/users/user-data';
import { AppLayout } from "@/components/layout/app-layout"; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Server, Settings, Globe, Shield, ListChecks, Trash2, PlusCircle } from 'lucide-react';
import { Form, FormField, FormItem, FormMessage, FormControl, FormDescription} from "@/components/ui/form";


const baseConfigSchema = z.object({}); 

const xrayConfigSchema = z.object({
  logLevel: z.enum(['debug', 'info', 'warning', 'error', 'none']),
  dnsServers: z.string().transform(val => val.split(',').map(s => s.trim()).filter(s => s)),
});

const openvpnConfigSchema = z.object({
  port: z.coerce.number().min(1).max(65535),
  proto: z.enum(['tcp', 'udp']),
  cipher: z.string().min(3),
  additionalDirectives: z.string().optional(),
});

const wireguardConfigSchema = z.object({
  listenPort: z.coerce.number().min(1).max(65535),
  address: z.string().min(7), 
  dnsServers: z.string().optional().transform(val => val ? val.split(',').map(s => s.trim()).filter(s => s) : []),
});

const singboxConfigSchema = z.object({
  logLevel: z.enum(['debug', 'info', 'warn', 'error', 'fatal', 'panic']),
  primaryDns: z.string().min(7), 
});

const torWarpConfigSchema = z.object({
  ports: z.string().transform(val => val.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n) && n > 0 && n <= 65535)),
  fakeDomain: z.string().min(3),
  selectedCountries: z.array(z.string()),
  enableCountrySelection: z.boolean(),
});

const psiphonConfigSchema = z.object({
  ports: z.string().transform(val => val.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n) && n > 0 && n <= 65535)),
  transportMode: z.enum(['SSH', 'OBFUSCATED_SSH', 'HTTP_PROXY']),
  selectedCountries: z.array(z.string()),
  enableCountrySelection: z.boolean(),
  customServerList: z.string().optional(),
});


export default function KernelSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const kernelId = params.kernelId as string;
  const [kernel, setKernel] = useState<Kernel | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const currentKernel = kernels.find(k => k.id === kernelId);
  let currentSchema = baseConfigSchema;
  if (currentKernel) {
    if (currentKernel.id === 'xray') currentSchema = xrayConfigSchema;
    else if (currentKernel.id === 'openvpn') currentSchema = openvpnConfigSchema;
    else if (currentKernel.id === 'wireguard') currentSchema = wireguardConfigSchema;
    else if (currentKernel.id === 'sing-box') currentSchema = singboxConfigSchema;
    else if (currentKernel.id === 'tor-service') currentSchema = torWarpConfigSchema; // Updated ID
    else if (currentKernel.id === 'psiphon-pro') currentSchema = psiphonConfigSchema;
  }


  const form = useForm({
    resolver: zodResolver(currentSchema),
  });

  useEffect(() => {
    const foundKernel = kernels.find(k => k.id === kernelId);
    if (foundKernel) {
      setKernel(foundKernel);
      let defaultConfigValues: any = {};
      if (foundKernel.config) {
        defaultConfigValues = { ...foundKernel.config };
        if ('dnsServers' in defaultConfigValues && Array.isArray(defaultConfigValues.dnsServers)) {
          defaultConfigValues.dnsServers = defaultConfigValues.dnsServers.join(', ');
        }
         if ('ports' in defaultConfigValues && Array.isArray(defaultConfigValues.ports)) {
          defaultConfigValues.ports = defaultConfigValues.ports.join(', ');
        }
        if (foundKernel.id === 'sing-box' && (foundKernel.config as SingBoxConfig).dns?.servers?.length) {
           defaultConfigValues.primaryDns = (foundKernel.config as SingBoxConfig).dns.servers[0];
        }
      }
      form.reset(defaultConfigValues);
    }
    setIsLoading(false);
  }, [kernelId, form]);


  const onSubmit = (data: any) => {
    console.log("Saving kernel settings (mock):", kernelId, data);
    
    const originalKernelConfig = kernels.find(k => k.id === kernelId)?.config;
    let updatedConfig = { ...originalKernelConfig, ...data };

    if (data.dnsServers && typeof data.dnsServers === 'string') {
      updatedConfig.dnsServers = data.dnsServers.split(',').map((s: string) => s.trim()).filter((s: string) => s);
    }
    if (data.ports && typeof data.ports === 'string') {
      updatedConfig.ports = data.ports.split(',').map((s: string) => Number(s.trim())).filter((n: number) => !isNaN(n) && n > 0 && n <= 65535);
    }
    if (kernel?.id === 'sing-box' && data.primaryDns) {
        updatedConfig.dns = { ...updatedConfig.dns, servers: [data.primaryDns] };
    }

    const kernelIndex = kernels.findIndex(k => k.id === kernelId);
    if (kernelIndex !== -1) {
      kernels[kernelIndex].config = updatedConfig as any; 
    }
    
    toast({
      title: `Settings Saved for ${kernel?.name}`,
      description: "Your configuration changes have been (mock) saved.",
    });
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <Settings className="h-12 w-12 animate-spin text-primary" />
          <p className="ms-4 font-body">Loading kernel settings...</p>
        </div>
      </AppLayout>
    );
  }

  if (!kernel) {
    return (
      <AppLayout>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Kernel Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-body">The requested kernel configuration could not be found.</p>
            <Button onClick={() => router.push('/kernels')} className="mt-4 font-body">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Kernels {/* Reverted rtl:scale-x-[-1] and me-2 to mr-2 */}
            </Button>
          </CardContent>
        </Card>
      </AppLayout>
    );
  }
  
  const renderKernelSettingsForm = () => {
    if (!kernel || !kernel.config) return <p className="font-body">No configuration available for this kernel.</p>;

    switch (kernel.id) {
      case 'xray':
        const xrayConf = kernel.config as XrayConfig;
        return (
          <>
            <FormField
              control={form.control}
              name="logLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-body">Log Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="font-body"><SelectValue placeholder="Select log level" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {['debug', 'info', 'warning', 'error', 'none'].map(level => (
                        <SelectItem key={level} value={level} className="font-body">{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dnsServers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-body">DNS Servers (comma-separated)</FormLabel>
                  <FormControl><Input {...field} placeholder="1.1.1.1, 8.8.8.8" className="font-body"/></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="text-sm text-muted-foreground mt-2 font-body">Xray inbounds and outbounds are typically managed globally in Managed Hosts for simplicity, but core DNS and log level can be set here.</p>
          </>
        );
      case 'openvpn':
        const ovpnConf = kernel.config as OpenVPNConfig;
        return (
          <>
            <FormField control={form.control} name="port" render={({ field }) => (<FormItem><FormLabel className="font-body">Port</FormLabel><FormControl><Input type="number" {...field} className="font-body"/></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="proto" render={({ field }) => (
                <FormItem><FormLabel className="font-body">Protocol</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger className="font-body"><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                        <SelectItem value="tcp" className="font-body">TCP</SelectItem>
                        <SelectItem value="udp" className="font-body">UDP</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="cipher" render={({ field }) => (<FormItem><FormLabel className="font-body">Cipher</FormLabel><FormControl><Input {...field} className="font-body"/></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="additionalDirectives" render={({ field }) => (<FormItem><FormLabel className="font-body">Additional Directives</FormLabel><FormControl><Textarea {...field} placeholder="# push redirect-gateway def1..." rows={3} className="font-body"/></FormControl><FormMessage /></FormItem>)} />
          </>
        );
      case 'wireguard':
        const wgConf = kernel.config as WireGuardConfig;
        return (
          <>
            <FormField control={form.control} name="listenPort" render={({ field }) => (<FormItem><FormLabel className="font-body">Listen Port</FormLabel><FormControl><Input type="number" {...field} className="font-body"/></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="address" render={({ field }) => (<FormItem><FormLabel className="font-body">Server Address (CIDR)</FormLabel><FormControl><Input {...field} placeholder="e.g., 10.0.0.1/24" className="font-body"/></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="dnsServers" render={({ field }) => (<FormItem><FormLabel className="font-body">DNS Servers (comma-separated)</FormLabel><FormControl><Input {...field} placeholder="1.1.1.1, 8.8.8.8" className="font-body"/></FormControl><FormMessage /></FormItem>)} />
          </>
        );
      case 'sing-box':
         const sbConf = kernel.config as SingBoxConfig;
        return (
           <>
            <FormField control={form.control} name="logLevel" render={({ field }) => (
                <FormItem><FormLabel className="font-body">Log Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger className="font-body"><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                        {['debug', 'info', 'warn', 'error', 'fatal', 'panic'].map(l => <SelectItem key={l} value={l} className="font-body">{l}</SelectItem>)}
                    </SelectContent>
                </Select>
                <FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="primaryDns" render={({ field }) => (<FormItem><FormLabel className="font-body">Primary DNS Server</FormLabel><FormControl><Input {...field} placeholder="1.1.1.1" className="font-body"/></FormControl><FormMessage /></FormItem>)} />
           </>
        );
      case 'tor-service': // Updated ID
        const torConf = kernel.config as TorWarpFakeSiteConfig;
        return (
            <>
                <FormField control={form.control} name="ports" render={({ field }) => (<FormItem><FormLabel className="font-body">Ports (comma-separated)</FormLabel><FormControl><Input {...field} placeholder="9050, 9150" className="font-body"/></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="fakeDomain" render={({ field }) => (<FormItem><FormLabel className="font-body">Fake Domain (for SNI)</FormLabel><FormControl><Input {...field} placeholder="speedtest.net" className="font-body"/></FormControl><FormMessage /></FormItem>)} />
                 <FormField
                    control={form.control}
                    name="enableCountrySelection"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <FormLabel htmlFor="enableTorCountrySelection" className="font-body">Enable Country Selection</FormLabel>
                        <FormControl><Checkbox id="enableTorCountrySelection" checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        </FormItem>
                    )}
                />
                {form.watch("enableCountrySelection") && (
                    <FormItem>
                        <FormLabel className="font-body">Select Exit Countries</FormLabel>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-2 border rounded-md max-h-48 overflow-y-auto">
                        {availableCountries.map(country => (
                            <FormField
                            key={country.code}
                            control={form.control}
                            name="selectedCountries"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0"> {/* Removed rtl:space-x-reverse */}
                                <FormControl>
                                <Checkbox
                                    checked={field.value?.includes(country.code)}
                                    onCheckedChange={(checked) => {
                                    return checked
                                        ? field.onChange([...(field.value || []), country.code])
                                        : field.onChange( (field.value || []).filter( (value) => value !== country.code ) );
                                    }}
                                />
                                </FormControl>
                                <FormLabel className="font-normal font-body">{country.flag} {country.name}</FormLabel>
                                </FormItem>
                            )}
                            />
                        ))}
                        </div>
                        <FormMessage />
                    </FormItem>
                )}
            </>
        );
        case 'psiphon-pro':
        const psiphonConf = kernel.config as PsiphonProConfig;
        return (
            <>
                <FormField control={form.control} name="ports" render={({ field }) => (<FormItem><FormLabel className="font-body">Ports (comma-separated)</FormLabel><FormControl><Input {...field} placeholder="1080, 8081" className="font-body"/></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="transportMode" render={({ field }) => (
                    <FormItem><FormLabel className="font-body">Transport Mode</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger className="font-body"><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="SSH" className="font-body">SSH</SelectItem>
                            <SelectItem value="OBFUSCATED_SSH" className="font-body">OBFUSCATED_SSH</SelectItem>
                            <SelectItem value="HTTP_PROXY" className="font-body">HTTP_PROXY</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage /></FormItem>
                )} />
                 <FormField
                    control={form.control}
                    name="enableCountrySelection"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <FormLabel htmlFor="enablePsiphonCountrySelection" className="font-body">Enable Country Selection</FormLabel>
                            <FormControl><Checkbox id="enablePsiphonCountrySelection" checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        </FormItem>
                    )}
                />
                {form.watch("enableCountrySelection") && (
                     <FormItem>
                        <FormLabel className="font-body">Select Preferred Countries</FormLabel>
                         <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-2 border rounded-md max-h-48 overflow-y-auto">
                        {availableCountries.map(country => (
                            <FormField
                            key={country.code}
                            control={form.control}
                            name="selectedCountries"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0"> {/* Removed rtl:space-x-reverse */}
                                <FormControl>
                                <Checkbox
                                    checked={field.value?.includes(country.code)}
                                    onCheckedChange={(checked) => {
                                    return checked
                                        ? field.onChange([...(field.value || []), country.code])
                                        : field.onChange( (field.value || []).filter( (value) => value !== country.code ) );
                                    }}
                                />
                                </FormControl>
                                <FormLabel className="font-normal font-body">{country.flag} {country.name}</FormLabel>
                                </FormItem>
                            )}
                            />
                        ))}
                        </div>
                        <FormMessage />
                    </FormItem>
                )}
                 <FormField control={form.control} name="customServerList" render={({ field }) => (<FormItem><FormLabel className="font-body">Custom Server List URL (Optional)</FormLabel><FormControl><Input {...field} placeholder="https://example.com/serverlist.txt" className="font-body"/></FormControl><FormMessage /></FormItem>)} />
            </>
        );

      default:
        return <p className="font-body">No specific settings form for this kernel type yet. Raw JSON: <pre className="text-xs bg-muted p-2 rounded font-mono">{JSON.stringify(kernel.config, null, 2)}</pre></p>;
    }
  };


  return (
    <AppLayout>
      <div className="space-y-6">
        <Button variant="outline" onClick={() => router.push('/kernels')} className="mb-4 font-body">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Kernels List {/* Reverted rtl:scale-x-[-1] and me-2 to mr-2 */}
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Server className="h-6 w-6 text-primary" />
              <CardTitle className="font-headline text-2xl">{kernel.name} Settings</CardTitle>
            </div>
            <CardDescription className="font-body">{kernel.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {renderKernelSettingsForm()}
                <Separator />
                <div className="flex justify-end">
                  <Button type="submit" className="font-body">Save Settings</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
