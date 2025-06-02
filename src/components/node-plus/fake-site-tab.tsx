
"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
  import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { initialPanelSettings, defaultInitialPanelSettings } from "@/app/users/user-data";
import { Globe, CheckCircle, AlertTriangle, Save, ShieldAlert, RotateCcw } from "lucide-react";

const fakeSiteSchema = z.object({
  isEnabled: z.boolean(),
  decoyDomain: z.string().min(3, "Decoy domain must be at least 3 characters long."),
  nginxConfigSnippet: z.string().min(20, "Nginx config snippet seems too short."),
  // isValidated is not part of the form, but managed internally
});

type FakeSiteFormData = z.infer<typeof fakeSiteSchema>;

export function FakeSiteTab() {
  const { toast } = useToast();
  // Local state for the form, initialized from global mock settings
  const [currentSettings, setCurrentSettings] = React.useState(initialPanelSettings.fakeSite);
  // Local state for validation status, separate from form data
  const [isValidated, setIsValidated] = React.useState(initialPanelSettings.fakeSite.isValidated);


  const form = useForm<FakeSiteFormData>({
    resolver: zodResolver(fakeSiteSchema),
    defaultValues: {
      isEnabled: currentSettings.isEnabled,
      decoyDomain: currentSettings.decoyDomain,
      nginxConfigSnippet: currentSettings.nginxConfigSnippet,
    },
  });

  React.useEffect(() => {
    // When initialPanelSettings (global mock) changes, update local state and form
    setCurrentSettings(initialPanelSettings.fakeSite);
    setIsValidated(initialPanelSettings.fakeSite.isValidated);
    form.reset({
        isEnabled: initialPanelSettings.fakeSite.isEnabled,
        decoyDomain: initialPanelSettings.fakeSite.decoyDomain,
        nginxConfigSnippet: initialPanelSettings.fakeSite.nginxConfigSnippet,
    });
  }, [initialPanelSettings.fakeSite, form]);


  const handleSaveChanges = (data: FakeSiteFormData) => {
    // Update the global mock settings object
    initialPanelSettings.fakeSite = {
        ...initialPanelSettings.fakeSite, // preserve isValidated
        ...data,
        isValidated: isValidated // ensure current validation state is saved
    };
    // Update local state to reflect saved data
    setCurrentSettings(initialPanelSettings.fakeSite);

    toast({
      title: "Fake Site Settings Saved",
      description: "Your Fake Site configurations have been (mock) saved.",
    });
  };

  const handleResetToDefaults = () => {
    // Reset local form state to pristine defaults
    form.reset({
        isEnabled: defaultInitialPanelSettings.fakeSite.isEnabled,
        decoyDomain: defaultInitialPanelSettings.fakeSite.decoyDomain,
        nginxConfigSnippet: defaultInitialPanelSettings.fakeSite.nginxConfigSnippet,
    });
    // Reset internal validation state
    setIsValidated(defaultInitialPanelSettings.fakeSite.isValidated);
    
    // Update the global mock settings object
    initialPanelSettings.fakeSite = JSON.parse(JSON.stringify(defaultInitialPanelSettings.fakeSite));
    setCurrentSettings(initialPanelSettings.fakeSite); // sync local state

    toast({
      title: "Fake Site Settings Reset",
      description: "Fake Site configurations have been reset to defaults (mocked).",
      variant: "default"
    });
  };

  const handleValidateAndActivate = () => {
    const mockIsValid = Math.random() > 0.3; 
    setIsValidated(mockIsValid);
    form.setValue("isEnabled", mockIsValid); // Enable only if validation passes

    // Update global mock settings
    initialPanelSettings.fakeSite.isValidated = mockIsValid;
    initialPanelSettings.fakeSite.isEnabled = mockIsValid;
    setCurrentSettings(initialPanelSettings.fakeSite); // Sync local state

    if (mockIsValid) {
      toast({
        title: "Fake Site Validated & Activated",
        description: "Fake Site (mock) validated and is now active.",
        className: "bg-green-500 text-white",
      });
    } else {
      toast({
        title: "Fake Site Validation Failed",
        description: "Mock validation failed. Check port/patch and Nginx config.",
        variant: "destructive",
      });
    }
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center"><Globe className="mr-2 h-6 w-6 text-primary" /> Fake Site System</CardTitle>
        <CardDescription className="font-body">
          Configure a decoy website to hide your panel from public access and automated filtering systems. Requires Nginx setup on your server.
        </CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(handleSaveChanges)}>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <Label htmlFor="enableFakeSite" className="text-base font-body">Enable Fake Site System</Label>
              <p className="text-sm text-muted-foreground font-body">
                Activates the Nginx-based decoy website.
              </p>
            </div>
             <Controller
                name="isEnabled"
                control={form.control}
                render={({ field }) => (
                    <Switch
                        id="enableFakeSite"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!isValidated && field.value === false} 
                    />
                )}
             />
          </div>
          
          {isValidated && form.watch("isEnabled") && (
             <div className="p-3 rounded-md bg-green-500/10 border border-green-500/30 text-green-700 dark:text-green-400 flex items-center space-x-2 text-sm">
                <CheckCircle className="h-5 w-5" />
                <p>Fake Site is active and validated. Your panel is now camouflaged.</p>
            </div>
          )}
           {!isValidated && form.watch("isEnabled") && (
             <div className="p-3 rounded-md bg-yellow-500/10 border border-yellow-500/30 text-yellow-700 dark:text-yellow-500 flex items-center space-x-2 text-sm">
                <AlertTriangle className="h-5 w-5" />
                <p>Fake Site is enabled but not validated. Please Validate & Activate.</p>
            </div>
          )}


          <div>
            <Label htmlFor="decoyDomain" className="font-body">Decoy Domain Name</Label>
            <Input
              id="decoyDomain"
              {...form.register("decoyDomain")}
              placeholder="e.g., decoy.example.com"
              className="font-body mt-1"
            />
            {form.formState.errors.decoyDomain && <p className="text-sm text-destructive mt-1">{form.formState.errors.decoyDomain.message}</p>}
          </div>

          <div>
            <Label htmlFor="nginxConfigSnippet" className="font-body">Nginx Configuration Snippet</Label>
            <Textarea
              id="nginxConfigSnippet"
              {...form.register("nginxConfigSnippet")}
              placeholder="Paste your Nginx server block for the fake site here..."
              className="font-mono text-xs min-h-[200px] mt-1"
            />
            {form.formState.errors.nginxConfigSnippet && <p className="text-sm text-destructive mt-1">{form.formState.errors.nginxConfigSnippet.message}</p>}
          </div>
          
          <div className="p-3 my-4 rounded-md bg-destructive/10 border border-destructive/30 text-destructive flex items-start space-x-2 text-sm">
            <ShieldAlert className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <p className="font-body">
              <strong>Important:</strong> When the Fake Site system is active, direct access to the real admin panel via its public IP/port may be blocked.
              Ensure you have SSH tunnel access or another secure method to manage the panel.
            </p>
          </div>

        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Button type="button" onClick={handleValidateAndActivate} variant="outline" className="font-body w-full sm:w-auto">
            <CheckCircle className="mr-2 h-4 w-4" /> (Mock) Validate & Activate
          </Button>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button type="button" onClick={handleResetToDefaults} variant="outline" className="font-body flex-grow sm:flex-grow-0">
                <RotateCcw className="mr-2 h-4 w-4" /> Reset
            </Button>
            <Button type="submit" className="font-body flex-grow sm:flex-grow-0">
                <Save className="mr-2 h-4 w-4" /> Save Settings
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
