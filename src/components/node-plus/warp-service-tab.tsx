
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { initialPanelSettings, PanelSettingsData } from "@/app/users/user-data";
import { ShieldQuestion, Save, CheckCircle, XCircle, Wifi, BarChart3 } from "lucide-react";
import Image from "next/image";

export function WarpServiceTab() {
  const { toast } = useToast();
  const [isEnabled, setIsEnabled] = React.useState(initialPanelSettings.warpService.isEnabled);
  const [licenseKey, setLicenseKey] = React.useState(initialPanelSettings.warpService.licenseKey);
  const [isLicenseValid, setIsLicenseValid] = React.useState<boolean | null>(null); // null: unchecked, true: valid, false: invalid
  const [apiHandshakeStatus, setApiHandshakeStatus] = React.useState<"Connected" | "Disconnected" | "Error">("Disconnected");

  const handleValidateLicense = () => {
    // Mock license validation
    if (licenseKey.startsWith("WARP-VALID-")) {
      setIsLicenseValid(true);
      setApiHandshakeStatus("Connected");
      toast({ title: "License Validated", description: "Warp license key is valid (mock)." });
    } else {
      setIsLicenseValid(false);
      setApiHandshakeStatus("Error");
      toast({ title: "License Invalid", description: "Warp license key is invalid (mock).", variant: "destructive" });
    }
  };

  const handleSaveChanges = () => {
    initialPanelSettings.warpService.isEnabled = isEnabled;
    initialPanelSettings.warpService.licenseKey = licenseKey;
    // In a real app, save this to your backend.
    toast({
      title: "Warp Service Settings Saved",
      description: `Warp service settings have been updated (mocked).`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center"><ShieldQuestion className="mr-2 h-6 w-6 text-primary" /> Warp Service Management</CardTitle>
        <CardDescription className="font-body">
          Manage the Cloudflare WARP service integration, including license validation and monitoring.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
          <div className="space-y-0.5">
            <Label htmlFor="enableWarpService" className="text-base font-body">Enable Warp Service</Label>
            <p className="text-sm text-muted-foreground font-body">
              Toggle the Cloudflare WARP service. Requires a valid license.
            </p>
          </div>
          <Switch
            id="enableWarpService"
            checked={isEnabled}
            onCheckedChange={setIsEnabled}
            aria-label="Enable Warp Service"
            disabled={!isLicenseValid} // Can only enable if license is valid
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="warpLicenseKey" className="font-body">Warp License Key</Label>
          <div className="flex items-center gap-2">
            <Input
              id="warpLicenseKey"
              value={licenseKey}
              onChange={(e) => {
                setLicenseKey(e.target.value);
                setIsLicenseValid(null); // Reset validation status on key change
                setApiHandshakeStatus("Disconnected");
              }}
              placeholder="Enter your Warp license key"
              className="font-body"
            />
            <Button type="button" variant="outline" onClick={handleValidateLicense} className="font-body">Validate License</Button>
          </div>
          {isLicenseValid === true && <p className="text-sm text-green-600 flex items-center gap-1"><CheckCircle size={16}/> License is valid.</p>}
          {isLicenseValid === false && <p className="text-sm text-destructive flex items-center gap-1"><XCircle size={16}/> License is invalid.</p>}
        </div>

        <div className="space-y-2">
            <Label className="font-body">Secure API Handshake Status</Label>
            <div className="flex items-center gap-2 p-2 border rounded-md bg-muted">
                {apiHandshakeStatus === "Connected" && <Wifi size={18} className="text-green-500" />}
                {apiHandshakeStatus === "Disconnected" && <Wifi size={18} className="text-gray-400" />}
                {apiHandshakeStatus === "Error" && <XCircle size={18} className="text-destructive" />}
                <span className="font-body text-sm">{apiHandshakeStatus} (Mock)</span>
            </div>
            <p className="text-xs text-muted-foreground font-body">Indicates if the panel is securely communicating with Warp services.</p>
        </div>
        
        <div className="space-y-2">
            <Label className="font-body">Geo-Distribution Analytics (Mock)</Label>
            <div className="p-4 border rounded-md bg-muted flex flex-col items-center justify-center min-h-[150px]">
                <BarChart3 size={32} className="text-primary mb-2" />
                <p className="text-sm text-muted-foreground font-body text-center">
                    Geo-distribution analytics for Warp traffic would be displayed here.
                    (Placeholder for chart or map visualization)
                </p>
                <Image
                  src="https://placehold.co/400x200.png"
                  alt="Mock Geo Analytics Chart"
                  width={400}
                  height={200}
                  className="mt-2 rounded-md opacity-50"
                  data-ai-hint="analytics chart"
                />
            </div>
        </div>

      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveChanges} className="font-body">
          <Save className="mr-2 h-4 w-4" /> Save Warp Settings
        </Button>
      </CardFooter>
    </Card>
  );
}

    