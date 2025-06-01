
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { initialPanelSettings } from "@/app/users/user-data";
import { ShieldQuestion, Save } from "lucide-react";

export function WarpServiceTab() {
  const { toast } = useToast();
  const [isEnabled, setIsEnabled] = React.useState(initialPanelSettings.warpService.isEnabled);

  const handleSaveChanges = () => {
    initialPanelSettings.warpService.isEnabled = isEnabled;
    // In a real app, save this to your backend.
    toast({
      title: "Warp Service Settings Saved",
      description: `Warp service is now ${isEnabled ? "enabled" : "disabled"} (mocked).`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center"><ShieldQuestion className="mr-2 h-6 w-6 text-primary" /> Warp Service Management</CardTitle>
        <CardDescription className="font-body">
          Manage the Cloudflare WARP service integration. (This is a placeholder for WARP-specific settings).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
          <div className="space-y-0.5">
            <Label htmlFor="enableWarpService" className="text-base font-body">Enable Warp Service</Label>
            <p className="text-sm text-muted-foreground font-body">
              Toggle the Cloudflare WARP service.
            </p>
          </div>
          <Switch
            id="enableWarpService"
            checked={isEnabled}
            onCheckedChange={setIsEnabled}
            aria-label="Enable Warp Service"
          />
        </div>
        <p className="text-muted-foreground font-body text-sm">
          Further WARP-specific configurations would appear here (e.g., connection mode, custom endpoints).
          Currently, this is a basic toggle for the service.
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveChanges} className="font-body">
          <Save className="mr-2 h-4 w-4" /> Save Warp Settings
        </Button>
      </CardFooter>
    </Card>
  );
}
