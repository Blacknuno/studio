
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GitCommitHorizontal, ShieldCheck, Zap, ServerIcon } from "lucide-react";
import { kernels, type Kernel } from "@/app/users/user-data"; // Import kernels from user-data
import { Badge } from "@/components/ui/badge";

const ProtocolIcon = ({ kernelCategory }: { kernelCategory: Kernel['category'] }) => {
  if (kernelCategory === "engine") {
    return <ShieldCheck className="h-5 w-5 text-primary" />;
  }
  return <ServerIcon className="h-5 w-5 text-primary" />; // Default for 'node' category
};

export function VersionDisplayCard() {
  const installedAndRunningKernels = kernels.filter(
    (k) => k.isInstalled && k.status === "Running"
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl">Active Core Services</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* OS Kernel information will be shown in SystemOverviewCard now */}
        
        <div>
          {installedAndRunningKernels.length > 0 ? (
            <>
              <h3 className="mb-2 font-medium font-body">Detected & Running Cores:</h3>
              <ul className="space-y-2">
                {installedAndRunningKernels.map((kernel) => (
                  <li key={kernel.id} className="flex items-center gap-3 p-3 bg-card-foreground/5 rounded-lg">
                    <ProtocolIcon kernelCategory={kernel.category} />
                    <div>
                      <p className="font-medium font-body">{kernel.name}</p>
                      <p className="text-sm text-muted-foreground font-body">
                        Version: {kernel.version || "N/A"}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="text-center py-4">
              <Zap className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <p className="font-body text-sm text-muted-foreground">
                No active core services detected or running based on current (mock) status.
              </p>
               <p className="text-xs text-muted-foreground font-body mt-1">
                Ensure cores are installed and started via the Kernels page.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
