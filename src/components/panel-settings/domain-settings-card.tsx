
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { initialPanelSettings, defaultInitialPanelSettings } from "@/app/users/user-data";
import { Globe, KeyRound, FileLock2, Save, RotateCcw } from "lucide-react";

export function DomainSettingsCard() {
  const { toast } = useToast();
  const [domainName, setDomainName] = React.useState(initialPanelSettings.domainName);
  const [sslPrivateKey, setSslPrivateKey] = React.useState(initialPanelSettings.sslPrivateKey);
  const [sslCertificate, setSslCertificate] = React.useState(initialPanelSettings.sslCertificate);

  // Update local state if global initialPanelSettings change (e.g., after a reset from another component if state was global)
  React.useEffect(() => {
    setDomainName(initialPanelSettings.domainName);
    setSslPrivateKey(initialPanelSettings.sslPrivateKey);
    setSslCertificate(initialPanelSettings.sslCertificate);
  }, [initialPanelSettings.domainName, initialPanelSettings.sslPrivateKey, initialPanelSettings.sslCertificate]);


  const handleSaveChanges = () => {
    initialPanelSettings.domainName = domainName;
    initialPanelSettings.sslPrivateKey = sslPrivateKey;
    initialPanelSettings.sslCertificate = sslCertificate;
    toast({
      title: "Domain Settings Saved",
      description: "Domain name and SSL/TLS settings have been (mock) updated.",
    });
  };

  const handleResetToDefaults = () => {
    setDomainName(defaultInitialPanelSettings.domainName);
    setSslPrivateKey(defaultInitialPanelSettings.sslPrivateKey);
    setSslCertificate(defaultInitialPanelSettings.sslCertificate);
    
    // Also update the 'live' settings object if it's being modified directly
    initialPanelSettings.domainName = defaultInitialPanelSettings.domainName;
    initialPanelSettings.sslPrivateKey = defaultInitialPanelSettings.sslPrivateKey;
    initialPanelSettings.sslCertificate = defaultInitialPanelSettings.sslCertificate;

    toast({
      title: "Domain Settings Reset",
      description: "Domain name and SSL/TLS settings have been reset to defaults (mocked).",
      variant: "default",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center">
          <Globe className="mr-2 h-6 w-6 text-primary"/> Domain & SSL/TLS Settings
        </CardTitle>
        <CardDescription className="font-body">
          Configure the domain name for your panel and manage SSL/TLS certificates.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="domainName" className="font-body">Domain Name</Label>
          <Input
            id="domainName"
            value={domainName}
            onChange={(e) => setDomainName(e.target.value)}
            placeholder="e.g., my.domain.com"
            className="font-body"
          />
          <p className="text-xs text-muted-foreground font-body">
            Enter the fully qualified domain name (FQDN) that points to this panel.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sslPrivateKey" className="font-body flex items-center">
             <KeyRound className="mr-2 h-4 w-4 text-muted-foreground"/> SSL Private Key
          </Label>
          <Textarea
            id="sslPrivateKey"
            value={sslPrivateKey}
            onChange={(e) => setSslPrivateKey(e.target.value)}
            placeholder="-----BEGIN PRIVATE KEY-----..."
            className="font-mono text-xs min-h-[120px]"
          />
          <p className="text-xs text-muted-foreground font-body">
            Paste your SSL private key here. Keep this secure.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sslCertificate" className="font-body flex items-center">
            <FileLock2 className="mr-2 h-4 w-4 text-muted-foreground"/> SSL Certificate (Public Key &amp; Intermediates)
          </Label>
          <Textarea
            id="sslCertificate"
            value={sslCertificate}
            onChange={(e) => setSslCertificate(e.target.value)}
            placeholder="-----BEGIN CERTIFICATE-----..."
            className="font-mono text-xs min-h-[150px]"
          />
          <p className="text-xs text-muted-foreground font-body">
            Paste your SSL certificate, including any intermediate certificates, in PEM format.
          </p>
        </div>
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
