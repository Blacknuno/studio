
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Shield } from "lucide-react";
import { initialPanelSettings, DEFAULT_USERNAME_FOR_SETUP } from "@/app/users/user-data"; 
// LanguageSwitcher and useLanguage removed

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  // const { t } = useLanguage(); // Removed
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loginPageBackground = initialPanelSettings.loginPageBackgroundImageUrl || "https://placehold.co/1920x1080.png";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (username === (initialPanelSettings.username === DEFAULT_USERNAME_FOR_SETUP ? DEFAULT_USERNAME_FOR_SETUP : "admin") && password === "password") { 
      toast({
        title: "Login Successful", // Reverted from t("login_successful")
        description: "Welcome back!", // Reverted from t("welcome_back")
      });
      if (initialPanelSettings.username === DEFAULT_USERNAME_FOR_SETUP) {
        toast({
          title: "Initial Setup Required", // Reverted from t("initial_setup_required")
          description: "Please change your default username and password in Panel Settings.", // Reverted from t("please_change_credentials")
          variant: "default",
          duration: 7000,
        });
      }
      router.push("/"); 
    } else {
      toast({
        title: "Login Failed", // Reverted from t("login_failed")
        description: "Invalid username or password.", // Reverted from t("invalid_credentials")
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
      <div className="absolute top-4 end-4">
        {/* LanguageSwitcher removed */}
      </div>
      <Card className="w-full max-w-md shadow-2xl bg-background/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex items-center justify-center">
            <Shield className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline">ProtocolPilot Login</CardTitle> {/* Reverted from t('login_title') */}
          <CardDescription className="font-body">
            Access your advanced protocol management panel. {/* Reverted from t('login_description') */}
            {initialPanelSettings.username === DEFAULT_USERNAME_FOR_SETUP && (
                 <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
                    Default credentials are in use. Please change them in Panel Settings after login. {/* Reverted from t('login_default_creds_warning') */}
                 </p>
            )}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="font-body">Username</Label> {/* Reverted from t('username_label') */}
              <Input
                id="username"
                type="text"
                placeholder="Enter your username" // Reverted from t('enter_username_placeholder')
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="font-body"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="font-body">Password</Label> {/* Reverted from t('password_label') */}
              <Input
                id="password"
                type="password"
                placeholder="Enter your password" // Reverted from t('enter_password_placeholder')
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="font-body"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full font-body" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"} {/* Reverted from t() calls */}
            </Button>
          </CardFooter>
        </form>
         <p className="text-xs text-center text-muted-foreground p-4 font-body">
            For demonstration: user `admin` or `{DEFAULT_USERNAME_FOR_SETUP}`, pass `password`. {/* Reverted from t() call */}
          </p>
      </Card>
    </div>
  );
}
