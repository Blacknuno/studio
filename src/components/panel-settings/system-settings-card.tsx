
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
import { initialPanelSettings } from "@/app/users/user-data";
import { ChangeUsernameDialog } from "./change-username-dialog";
import { ChangePasswordDialog } from "./change-password-dialog";
import { Info, Edit2 } from "lucide-react";

export function SystemSettingsCard() {
  const { toast } = useToast();
  const [loginPort, setLoginPort] = React.useState(initialPanelSettings.loginPort);
  const [loginPath, setLoginPath] = React.useState(initialPanelSettings.loginPath);
  const [currentUsername, setCurrentUsername] = React.useState(initialPanelSettings.username);

  const [isUsernameDialogOpen, setIsUsernameDialogOpen] = React.useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = React.useState(false);

  const handleSaveSystemSettings = () => {
    // In a real app, you'd save these to a backend.
    console.log("Saving system settings:", { loginPort, loginPath });
    toast({
      title: "System Settings Saved",
      description: "Login port and path have been updated (mocked).",
    });
  };

  const handleUsernameChange = (newUsername: string) => {
    setCurrentUsername(newUsername);
    // In a real app, save to backend
    toast({
      title: "Username Changed",
      description: `Username updated to ${newUsername} (mocked).`,
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl">System Access Settings</CardTitle>
          <CardDescription className="font-body">
            Configure panel access details and administrator credentials.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
