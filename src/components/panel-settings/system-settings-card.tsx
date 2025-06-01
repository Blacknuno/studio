
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
import { initialPanelSettings, DEFAULT_USERNAME_FOR_SETUP } from "@/app/users/user-data";
import { ChangeUsernameDialog } from "./change-username-dialog";
import { ChangePasswordDialog } from "./change-password-dialog";
import { Info, Edit2, Image as ImageIcon, Upload, AlertTriangle } from "lucide-react";
import Image from "next/image"; // For previewing the image
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function SystemSettingsCard() {
  const { toast } = useToast();
  const [loginPort, setLoginPort] = React.useState(initialPanelSettings.loginPort);
  const [loginPath, setLoginPath] = React.useState(initialPanelSettings.loginPath);
  const [currentUsername, setCurrentUsername] = React.useState(initialPanelSettings.username);
  const [loginBgUrl, setLoginBgUrl] = React.useState(initialPanelSettings.loginPageBackgroundImageUrl || "https://placehold.co/1920x1080.png?text=Login+Background");

  const [isUsernameDialogOpen, setIsUsernameDialogOpen] = React.useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = React.useState(false);

  const handleSaveSystemSettings = () => {
    initialPanelSettings.loginPort = loginPort;
    initialPanelSettings.loginPath = loginPath;
    console.log("Saving system settings:", { loginPort, loginPath });
    toast({
      title: "System Settings Saved",
      description: "Login port and path have been updated (mocked).",
    });
  };

  const handleUsernameChange = (newUsername: string) => {
    setCurrentUsername(newUsername);
    initialPanelSettings.username = newUsername;
    toast({
      title: "Username Changed",
      description: `Username updated to ${newUsername} (mocked).`,
    });
  };

  const handleLoginBgUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Mock upload: In a real app, upload to server and get URL
      const mockNewUrl = URL.createObjectURL(file); // Temporary local URL for preview
      setLoginBgUrl(mockNewUrl); // Update preview
      initialPanelSettings.loginPageBackgroundImageUrl = "mock/uploaded/image.jpg"; // Mock backend update
      toast({
        title: "Login Background Updated",
        description: "Background image has been (mock) updated. Preview changed.",
      });
      // Clean up object URL after a delay if it's a local preview
      // setTimeout(() => URL.revokeObjectURL(mockNewUrl), 5000);
    }
  };


  const isDefaultCredentials = currentUsername === DEFAULT_USERNAME_FOR_SETUP;


  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl">System Access Settings</CardTitle>
          <CardDescription className="font-body">
            Configure panel access details, administrator credentials, and login page appearance.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isDefaultCredentials && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="font-headline">Initial Setup Required</AlertTitle>
              <AlertDescription className="font-body">
                The panel is using default administrator credentials. For security, please change your <strong>username</strong> and <strong>password</strong> immediately.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="ipAddress" className="font-body flex items-center">
              <Info className="h-4 w-4 mr-2 text-muted-foreground" />
              Panel IP Address (Read-only)
            </Label>
            <Input id="ipAddress" value={initialPanelSettings.ipAddress} readOnly className="font-body" />
            <p className="text-xs text-muted-foreground font-body">
              This is typically the IP address of your server.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="loginPort" className="font-body">Login Port</Label>
              <Input
                id="loginPort"
                type="number"
                value={loginPort}
                onChange={(e) => setLoginPort(parseInt(e.target.value, 10) || 0)}
                className="font-body"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loginPath" className="font-body">Login Path</Label>
              <Input
                id="loginPath"
                value={loginPath}
                onChange={(e) => setLoginPath(e.target.value)}
                className="font-body"
                placeholder="/admin"
              />
            </div>
          </div>
          <div className="flex justify-end">
             <Button onClick={handleSaveSystemSettings} className="font-body">Save Port & Path</Button>
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
                        <div className="mt-2 w-full aspect-video max-w-sm rounded-md border bg-muted overflow-hidden">
                             <Image
                                src={loginBgUrl}
                                alt="Login background preview"
                                width={400}
                                height={225}
                                className="object-cover w-full h-full"
                                data-ai-hint="abstract background"
                                unoptimized={loginBgUrl.startsWith('blob:')} // Prevent Next.js optimization for blob URLs
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
                            {/* The button below is not strictly necessary if the input itself is styled or if upload is auto on select */}
                            {/* <Button type="button" variant="outline" onClick={() => document.getElementById('loginBgUpload')?.click()} className="font-body">
                                <Upload className="mr-2 h-4 w-4" /> Choose Image
                            </Button> */}
                        </div>
                        <p className="text-xs text-muted-foreground font-body mt-1">
                            Select an image to use as the background for the login page. (Mock upload)
                        </p>
                    </div>
                </div>
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
