
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Shield, Info, AlertTriangle } from "lucide-react";
import { initialPanelSettings, DEFAULT_USERNAME_FOR_SETUP } from "@/app/users/user-data";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function PanelAdminPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loginPageBackground = initialPanelSettings.loginPageBackgroundImageUrl || "https://placehold.co/1920x1080.png";
  const panelAccessInfo = `http://<YOUR_SERVER_IP>:${initialPanelSettings.loginPort}${initialPanelSettings.loginPath}`;


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    // The install script sets the default username (DEFAULT_USERNAME_FOR_SETUP from user-data.ts, which is 'admin').
    // The password is randomly generated by the script, so the frontend cannot know it.
    // Thus, for this mock login, we check against the default username and accept any password.
    if (username === DEFAULT_USERNAME_FOR_SETUP) {
      toast({
        title: "Login Successful",
        description: "Welcome to ProtocolPilot!",
      });
      // Show this toast if the user is logging in with the default setup username
      // This reminds them to change it in Panel Settings for security.
      toast({
        title: "Initial Setup Recommended",
        description: "Please change your admin username and password in Panel Settings for security.",
        variant: "default", 
        duration: 7000,
      });
      router.push("/");
    } else {
      toast({
        title: "Login Failed",
        description: `Invalid username or password. (Mock: Use username '${DEFAULT_USERNAME_FOR_SETUP}' with any password)`,
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center p-4 bg-cover bg-center relative"
      style={{ backgroundImage: `url(${loginPageBackground})` }}
      data-ai-hint="abstract background"
    >
      <div className="absolute top-0 inset-x-0 p-4 md:p-8 flex justify-center">
        <Alert className="max-w-2xl bg-background/80 backdrop-blur-sm shadow-lg">
          <Info className="h-5 w-5" />
          <AlertTitle className="font-headline">Welcome to ProtocolPilot!</AlertTitle>
          <AlertDescription className="font-body space-y-1">
            <p>
              After installation, your panel is accessible via:
              <code className="block bg-muted p-1 my-1 rounded text-sm">{panelAccessInfo}</code>
              (Replace <code>&lt;YOUR_SERVER_IP&gt;</code> with your server's actual IP address)
            </p>
            <p>
              The installation script has generated initial admin credentials:
            </p>
            <ul className="list-disc list-inside text-sm space-y-0.5 ps-1">
              <li><strong>Admin Username:</strong> <code>{DEFAULT_USERNAME_FOR_SETUP}</code></li>
              <li><strong>Admin Password:</strong> (Displayed at the end of the installation script output)</li>
            </ul>
            <p className="mt-1.5 text-xs text-amber-700 dark:text-amber-500">
              <strong>Important Security Note:</strong>
              Log in immediately using the credentials provided by the installation script.
              Then, navigate to "Panel Settings" to change both the admin username and password.
            </p>
          </AlertDescription>
        </Alert>
      </div>

      <Card className="w-full max-w-md shadow-2xl bg-background/80 backdrop-blur-sm mt-56 sm:mt-64 md:mt-72">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex items-center justify-center">
            <Shield className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline">ProtocolPilot Login</CardTitle>
          <CardDescription className="font-body">
            Access your advanced protocol management panel.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="font-body">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="font-body"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="font-body">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="font-body"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full font-body" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
