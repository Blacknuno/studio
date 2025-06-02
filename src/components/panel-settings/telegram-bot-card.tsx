
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { initialPanelSettings, defaultInitialPanelSettings } from "@/app/users/user-data";
import { Badge } from "@/components/ui/badge";
import { Bot, Plug, Unplug, UserCircle, Save, RotateCcw } from "lucide-react";

export function TelegramBotCard() {
  const { toast } = useToast();
  const [botToken, setBotToken] = React.useState(initialPanelSettings.telegramBotToken);
  const [adminChatId, setAdminChatId] = React.useState(initialPanelSettings.telegramAdminChatId);
  const [botUsername, setBotUsername] = React.useState(initialPanelSettings.telegramBotUsername || "");
  const [adminUsername, setAdminUsername] = React.useState(initialPanelSettings.telegramAdminUsername || "");
  const [isConnected, setIsConnected] = React.useState(initialPanelSettings.isTelegramBotConnected);

  React.useEffect(() => {
    setBotToken(initialPanelSettings.telegramBotToken);
    setAdminChatId(initialPanelSettings.telegramAdminChatId);
    setBotUsername(initialPanelSettings.telegramBotUsername || "");
    setAdminUsername(initialPanelSettings.telegramAdminUsername || "");
    setIsConnected(initialPanelSettings.isTelegramBotConnected);
  }, [
    initialPanelSettings.telegramBotToken, 
    initialPanelSettings.telegramAdminChatId, 
    initialPanelSettings.telegramBotUsername, 
    initialPanelSettings.telegramAdminUsername, 
    initialPanelSettings.isTelegramBotConnected
  ]);

  const handleSaveChanges = () => {
     initialPanelSettings.telegramBotToken = botToken;
     initialPanelSettings.telegramAdminChatId = adminChatId;
     initialPanelSettings.telegramBotUsername = botUsername;
     initialPanelSettings.telegramAdminUsername = adminUsername;
     initialPanelSettings.isTelegramBotConnected = isConnected; // Save connection state too
    toast({
      title: "Telegram Bot Settings Saved",
      description: "Bot configuration has been (mock) updated.",
    });
  }
  
  const handleResetToDefaults = () => {
    setBotToken(defaultInitialPanelSettings.telegramBotToken);
    setAdminChatId(defaultInitialPanelSettings.telegramAdminChatId);
    setBotUsername(defaultInitialPanelSettings.telegramBotUsername || "");
    setAdminUsername(defaultInitialPanelSettings.telegramAdminUsername || "");
    setIsConnected(defaultInitialPanelSettings.isTelegramBotConnected);

    initialPanelSettings.telegramBotToken = defaultInitialPanelSettings.telegramBotToken;
    initialPanelSettings.telegramAdminChatId = defaultInitialPanelSettings.telegramAdminChatId;
    initialPanelSettings.telegramBotUsername = defaultInitialPanelSettings.telegramBotUsername;
    initialPanelSettings.telegramAdminUsername = defaultInitialPanelSettings.telegramAdminUsername;
    initialPanelSettings.isTelegramBotConnected = defaultInitialPanelSettings.isTelegramBotConnected;
    
    toast({
      title: "Telegram Bot Settings Reset",
      description: "Bot configuration has been reset to defaults (mocked).",
      variant: "default"
    });
  }


  const handleToggleConnection = () => {
    const newConnectionState = !isConnected;
    setIsConnected(newConnectionState);
    // This state change will be persisted on "Save Settings"
    toast({
      title: `Telegram Bot will be ${newConnectionState ? "Connected" : "Disconnected"}`,
      description: `The bot status change will be applied when you save settings.`,
    });
  };
  

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center">
          <Bot className="mr-2 h-6 w-6 text-primary"/> Telegram Bot Integration
        </CardTitle>
        <CardDescription className="font-body">
          Connect a Telegram bot to manage users, configurations, and receive notifications.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="botToken" className="font-body">Bot Token</Label>
              <Input
                id="botToken"
                type="password"
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                placeholder="Enter your Telegram Bot Token"
                className="font-body"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminChatId" className="font-body">Admin Chat ID</Label>
              <Input
                id="adminChatId"
                value={adminChatId}
                onChange={(e) => setAdminChatId(e.target.value)}
                placeholder="Enter your Telegram Admin Chat ID"
                className="font-body"
              />
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="botUsername" className="font-body flex items-center">
                <UserCircle className="mr-1 h-4 w-4 text-muted-foreground" /> Bot Username (Optional)
              </Label>
              <Input
                id="botUsername"
                value={botUsername}
                onChange={(e) => setBotUsername(e.target.value)}
                placeholder="e.g., MyPanelBot"
                className="font-body"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminUsername" className="font-body flex items-center">
                 <UserCircle className="mr-1 h-4 w-4 text-muted-foreground" /> Panel Admin Username (Telegram, Optional)
              </Label>
              <Input
                id="adminUsername"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                placeholder="e.g., your_admin_tg_username"
                className="font-body"
              />
            </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="font-body">
            Connection Status: 
            <Badge variant={isConnected ? "default" : "secondary"} className="ml-2 text-sm">
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
          </div>
          <Button onClick={handleToggleConnection} variant="outline" className="font-body">
            {isConnected ? <Unplug className="mr-2 h-4 w-4" /> : <Plug className="mr-2 h-4 w-4" />}
            {isConnected ? "Set to Disconnect" : "Set to Connect"}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground font-body">
          Ensure your bot token and admin chat ID are correct. Connecting the bot enables features like automated user management and configuration delivery via Telegram. Usernames are for informational purposes. Remember to save settings to apply changes.
        </p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button onClick={handleResetToDefaults} variant="outline" className="font-body">
            <RotateCcw className="mr-2 h-4 w-4" /> Reset to Defaults
        </Button>
        <Button onClick={handleSaveChanges} className="font-body">
            <Save className="mr-2 h-4 w-4" /> Save Settings
        </Button>
      </CardFooter>
    </Card>
  );
}
