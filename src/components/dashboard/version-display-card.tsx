
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GitCommitHorizontal, ShieldCheck, Zap } from "lucide-react"; // Changed GitCommit to GitCommitHorizontal
import { versionInfo } from "./mock-data";

const ProtocolIcon = ({ name }: { name: string }) => {
  if (name.toLowerCase().includes("openvpn") || name.toLowerCase().includes("wireguard")) {
    return <ShieldCheck className="h-5 w-5 text-primary" />;
  }
  return <Zap className="h-5 w-5 text-primary" />;
};

export function VersionDisplayCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl">Core Versions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-card-foreground/5 rounded-lg">
          <GitCommitHorizontal className="h-5 w-5 text-primary" />
          <div>
            <p className="font-medium font-body">Kernel Version</p>
            <p className="text-sm text-muted-foreground font-body">{versionInfo.kernel}</p>
          </div>
        </div>
        <div>
          <h3 className="mb-2 font-medium font-body">Supported Protocols</h3>
          <ul className="space-y-2">
            {versionInfo.protocols.map((proto) => (
              <li key={proto.name} className="flex items-center gap-3 p-3 bg-card-foreground/5 rounded-lg">
                <ProtocolIcon name={proto.name} />
                <div>
                  <p className="font-medium font-body">{proto.name}</p>
                  <p className="text-sm text-muted-foreground font-body">Version: {proto.version}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
