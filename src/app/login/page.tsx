
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Shield, Info } from "lucide-react";
import { initialPanelSettings, DEFAULT_USERNAME_FOR_SETUP } from "@/app/users/user-data";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loginPageBackground = initialPanelSettings.loginPageBackgroundImageUrl || "https://placehold.co/1920x1080.png";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    // Check if using default setup username or the standard 'admin'
    const isDefaultUserLogin = username === DEFAULT_USERNAME_FOR_SETUP;
    const isAdminLogin = username === "admin";

    if ((isDefaultUserLogin || isAdminLogin) && password === "password") {
      toast({
        title: "Login Successful",
        description: "Welcome to ProtocolPilot!",
      });
      if (isDefaultUserLogin) {
        toast({
          title: "Initial Setup Recommended",
          description: "Please change your default username and password in Panel Settings for security.",
          variant: "default", // "default" is often yellow/amber, or use a custom variant if defined
          duration: 7000,
        });
      }
      router.push("/");
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid username or password.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center p-4 bg-cover bg-center relative"
      style={{ backgroundImage: `url(${loginPageBackground})` }}
    >
      <div className="absolute top-0 inset-x-0 p-4 md:p-8 flex justify-center">
        <Alert className="max-w-2xl bg-background/80 backdrop-blur-sm shadow-lg">
          <Info className="h-5 w-5" />
          <AlertTitle className="font-headline">Welcome to ProtocolPilot Setup!</AlertTitle>
          <AlertDescription className="font-body space-y-1">
            <p>
              If this is your first time running the panel, use the default credentials:
            </p>
            <ul className="list-disc list-inside text-sm space-y-0.5 ps-1">
              <li><strong>Default Username:</strong> <code>{DEFAULT_USERNAME_FOR_SETUP}</code></li>
              <li><strong>Default Password:</strong> <code>password</code></li>
            </ul>
            <p className="mt-1.5">
              Access the panel via: <code>http://&lt;YOUR_SERVER_IP&gt;:{initialPanelSettings.loginPort}{initialPanelSettings.loginPath}</code>
            </p>
            <p className="mt-1.5 text-xs text-amber-700 dark:text-amber-500">
              <strong>Important:</strong> After your first login, please go to "Panel Settings" to change the default username and password immediately.
            </p>
          </AlertDescription>
        </Alert>
      </div>

      <Card className="w-full max-w-md shadow-2xl bg-background/80 backdrop-blur-sm mt-48 sm:mt-56 md:mt-64">
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
         <p className="text-xs text-center text-muted-foreground px-4 py-2 font-body">
            (You can also use `admin` / `password` for quick access if default is unchanged.)
          </p>
      </Card>
    </div>
  );
}
