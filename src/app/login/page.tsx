
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Shield } from "lucide-react";
import { initialPanelSettings, DEFAULT_USERNAME_FOR_SETUP } from "@/app/users/user-data"; // Import initial settings

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // In a real app, this background URL would come from panel settings
  const loginPageBackground = initialPanelSettings.loginPageBackgroundImageUrl || "https://placehold.co/1920x1080.png?text=Login+Background";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock login logic
    // In a real app, you would call an API to authenticate
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (username === (initialPanelSettings.username === DEFAULT_USERNAME_FOR_SETUP ? DEFAULT_USERNAME_FOR_SETUP : "admin") && password === "password") { // Simplified mock check
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      if (initialPanelSettings.username === DEFAULT_USERNAME_FOR_SETUP) {
        toast({
          title: "Initial Setup Required",
          description: "Please change your default username and password in Panel Settings.",
          variant: "default",
          duration: 7000,
        });
      }
      router.push("/"); // Redirect to dashboard
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
      className="flex min-h-screen items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: `url(${loginPageBackground})` }}
    >
      <Card className="w-full max-w-md shadow-2xl bg-background/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex items-center justify-center">
            <Shield className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline">ProtocolPilot Login</CardTitle>
          <CardDescription className="font-body">
            Access your advanced protocol management panel.
            {initialPanelSettings.username === DEFAULT_USERNAME_FOR_SETUP && (
                 <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
                    Default credentials are in use. Please change them in Panel Settings after login.
                 </p>
            )}
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
         <p className="text-xs text-center text-muted-foreground p-4 font-body">
            For demonstration: user `admin` or `{DEFAULT_USERNAME_FOR_SETUP}`, pass `password`.
          </p>
      </Card>
    </div>
  );
}
