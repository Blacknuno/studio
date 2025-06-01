
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { initialPanelSettings } from "@/app/users/user-data";
import { Globe, KeyRound, FileLock2 } from "lucide-react";

export function DomainSettingsCard() {
  const { toast } = useToast();
  const [domainName, setDomainName] = React.useState(initialPanelSettings.domainName);
  const [sslPrivateKey, setSslPrivateKey] = React.useState(initialPanelSettings.sslPrivateKey);
  const [sslCertificate, setSslCertificate] = React.useState(initialPanelSettings.sslCertificate);

  const handleSaveChanges = () => {
    // In a real app, you'd securely save these to a backend and apply them.
    console.log("Saving domain settings:", { domainName, sslPrivateKey, sslCertificate });
    toast({
      title: "Domain Settings Saved",
      description: "Domain name and SSL/TLS settings have been updated (mocked).",
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
        <div className="flex justify-end">
            <Button onClick={handleSaveChanges} className="font-body">Save Domain Settings</Button>
        </div>
      </CardContent>
    </Card>
  );
}
