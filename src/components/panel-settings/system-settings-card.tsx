
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { initialPanelSettings, defaultInitialPanelSettings, DEFAULT_USERNAME_FOR_SETUP } from "@/app/users/user-data";
import { ChangeUsernameDialog } from "./change-username-dialog";
import { ChangePasswordDialog } from "./change-password-dialog";
import { Edit2, Image as ImageIcon, AlertTriangle, Server, RotateCcw, Save } from "lucide-react";
import Image from "next/image"; 
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function SystemSettingsCard() {
  const { toast } = useToast();
  
  // State for fields that are "savable" via this card
  const [currentUsername, setCurrentUsername] = React.useState(initialPanelSettings.username);
  const [loginBgUrl, setLoginBgUrl] = React.useState(initialPanelSettings.loginPageBackgroundImageUrl || defaultInitialPanelSettings.loginPageBackgroundImageUrl);

  const [isUsernameDialogOpen, setIsUsernameDialogOpen] = React.useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = React.useState(false);

  // Derived from initialPanelSettings for read-only display
  const displayLoginPort = initialPanelSettings.loginPort;
  const displayLoginPath = initialPanelSettings.loginPath;
  const displayIpAddress = initialPanelSettings.ipAddress;


  const handleSaveChanges = () => {
    // Only save settings managed by this card: username (via dialog), loginBgUrl
    initialPanelSettings.username = currentUsername; // Username is updated by its dialog, this ensures sync if needed
    initialPanelSettings.loginPageBackgroundImageUrl = loginBgUrl;
    
    toast({
      title: "System Settings Saved",
      description: "Administrator credentials and login page appearance have been (mock) updated.",
    });
  };

  const handleResetToDefaults = () => {
    setCurrentUsername(defaultInitialPanelSettings.username);
    setLoginBgUrl(defaultInitialPanelSettings.loginPageBackgroundImageUrl || "https://placehold.co/1920x1080.png");
    
    // Update the main initialPanelSettings object to reflect reset for these specific fields
    initialPanelSettings.username = defaultInitialPanelSettings.username;
    initialPanelSettings.loginPageBackgroundImageUrl = defaultInitialPanelSettings.loginPageBackgroundImageUrl;

    toast({
      title: "System Settings Reset",
      description: "Login page background and admin username (if changed by dialog) have been reset to defaults (mocked).",
      variant: "default"
    });
  };


  const handleUsernameChange = (newUsername: string) => {
    setCurrentUsername(newUsername);
    initialPanelSettings.username = newUsername; // Mock save immediately
    toast({
      title: "Username Changed",
      description: `Username updated to ${newUsername} (mocked). You may need to save overall system settings.`,
    });
  };

  const handleLoginBgUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const mockNewUrl = URL.createObjectURL(file); 
      setLoginBgUrl(mockNewUrl); 
      // initialPanelSettings.loginPageBackgroundImageUrl is updated on global save
      toast({
        title: "Login Background Preview Updated",
        description: "Background image preview changed. Click 'Save Settings' to apply.",
      });
    }
  };
  
  const isPotentiallyDefaultUsername = currentUsername === DEFAULT_USERNAME_FOR_SETUP;


  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl">System Access Settings</CardTitle>
          <CardDescription className="font-body">
            Configure panel access details, administrator credentials, and login page appearance.
            Core server IP and Port are set during installation and shown for reference.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isPotentiallyDefaultUsername && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="font-headline">Default Admin Username In Use</AlertTitle>
              <AlertDescription className="font-body">
                The panel administrator username is currently 'admin'. For enhanced security, please consider changing the <strong>username</strong> and ensure you have a strong <strong>password</strong>.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-1">
            <Label htmlFor="ipAddress" className="font-body flex items-center">
              <Server className="h-4 w-4 mr-2 text-muted-foreground" />
              Server IP Address
            </Label>
            <Input id="ipAddress" value={displayIpAddress} readOnly className="font-body bg-muted cursor-not-allowed" />
            <p className="text-xs text-muted-foreground font-body">
              Set by server <code>.env</code> file during installation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="loginPort" className="font-body">Panel Login Port</Label>
              <Input
                id="loginPort"
                type="number"
                value={displayLoginPort}
                readOnly
                className="font-body bg-muted cursor-not-allowed"
              />
               <p className="text-xs text-muted-foreground font-body">
                Set by server <code>.env</code> (e.g., 3000).
              </p>
            </div>
            <div className="space-y-1">
              <Label htmlFor="loginPath" className="font-body">Panel Login Path</Label>
              <Input
                id="loginPath"
                value={displayLoginPath}
                readOnly
                className="font-body bg-muted cursor-not-allowed"
              />
               <p className="text-xs text-muted-foreground font-body">
                Base path for login page (e.g., /paneladmin).
              </p>
            </div>
          </div>
          
          <hr className="my-4"/>

          <div className="space-y-4">
            <div>
              <Label className="font-body">Administrator Username</Label>
              <div className="flex items-center justify-between mt-1">
                <p className="text-lg font-body font-medium p-2 border rounded-md bg-muted flex-grow mr-2">{currentUsername}</p>
                <Button variant="outline" onClick={() => setIsUsernameDialogOpen(true)} className="font-body">
                  <Edit2 className="mr-2 h-4 w-4" /> Change Username
                </Button>
              </div>
            </div>
             <div>
              <Label className="font-body">Administrator Password</Label>
              <div className="flex items-center justify-between mt-1">
                 <p className="text-lg font-body font-medium p-2 border rounded-md bg-muted flex-grow mr-2">**********</p>
                <Button variant="outline" onClick={() => setIsPasswordDialogOpen(true)} className="font-body">
                  <Edit2 className="mr-2 h-4 w-4" /> Change Password
                </Button>
              </div>
            </div>
          </div>

          <hr className="my-4"/>
            <div>
                <h3 className="font-headline text-lg mb-2 flex items-center">
                    <ImageIcon className="mr-2 h-5 w-5 text-muted-foreground" /> Login Page Background
                </h3>
                <div className="space-y-4">
                    <div>
                        <Label className="font-body">Current Background Preview:</Label>
                        <div className="mt-2 w-full aspect-[16/9] max-w-sm rounded-md border bg-muted overflow-hidden">
                             <Image
                                src={loginBgUrl || "https://placehold.co/1920x1080.png"}
                                alt="Login background preview"
                                width={1920}
                                height={1080}
                                className="object-cover w-full h-full"
                                data-ai-hint="abstract background"
                                unoptimized={loginBgUrl?.startsWith('blob:')} 
                            />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="loginBgUpload" className="font-body">Upload New Background</Label>
                        <div className="flex items-center gap-2 mt-1">
                            <Input
                                id="loginBgUpload"
                                type="file"
                                accept="image/*"
                                onChange={handleLoginBgUpload}
                                className="font-body flex-grow"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground font-body mt-1">
                            Recommended: 1920x1080px. Click "Save Settings" below to apply.
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
                <Button onClick={handleResetToDefaults} variant="outline" className="font-body">
                    <RotateCcw className="mr-2 h-4 w-4" /> Reset to Defaults
                </Button>
                <Button onClick={handleSaveChanges} className="font-body">
                    <Save className="mr-2 h-4 w-4" /> Save Settings
                </Button>
            </div>
        </CardContent>
      </Card>

      <ChangeUsernameDialog
        isOpen={isUsernameDialogOpen}
        onClose={() => setIsUsernameDialogOpen(false)}
        currentUsername={currentUsername}
        onSave={handleUsernameChange}
      />
      <ChangePasswordDialog
        isOpen={isPasswordDialogOpen}
        onClose={() => setIsPasswordDialogOpen(false)}
      />
    </>
  );
}
