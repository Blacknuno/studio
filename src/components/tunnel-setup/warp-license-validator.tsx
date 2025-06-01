
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, ShieldQuestion, Loader2, AlertTriangle } from "lucide-react";

interface WarpLicenseValidatorProps {
  onLicenseValidated: () => void;
}

export function WarpLicenseValidator({ onLicenseValidated }: WarpLicenseValidatorProps) {
  const [licenseKey, setLicenseKey] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = useToast();

  const handleValidate = () => {
    setIsLoading(true);
    setError(null);
    // Mock validation logic
    setTimeout(() => {
      if (licenseKey.startsWith("WARP-VALID-") || licenseKey === "mock-valid") { // Simple mock check
        toast({
          title: "License Validated (Mock)",
          description: "Your Warp license key has been successfully validated.",
        });
        onLicenseValidated();
      } else {
        setError("Invalid license key. Please check your key and try again.");
        toast({
          title: "License Validation Failed (Mock)",
          description: "The provided Warp license key is not valid.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl">Validate Warp License</CardTitle>
        <CardDescription className="font-body">
          Please enter your Cloudflare Warp license key to proceed.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="warpLicense" className="font-body">Warp License Key</Label>
          <Input
            id="warpLicense"
            value={licenseKey}
            onChange={(e) => {
                setLicenseKey(e.target.value);
                setError(null);
            }}
            placeholder="Enter your license key"
            className="font-body"
            disabled={isLoading}
          />
        </div>
        {error && (
          <p className="text-sm text-destructive flex items-center gap-1 font-body">
            <AlertTriangle className="h-4 w-4"/> {error}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleValidate} disabled={isLoading || !licenseKey} className="font-body">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Validating...
            </>
          ) : (
            <>
              <ShieldQuestion className="mr-2 h-4 w-4" />
              Validate License
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
