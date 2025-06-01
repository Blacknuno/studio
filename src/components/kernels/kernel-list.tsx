
"use client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { kernels, type KernelStatus } from "@/app/users/user-data"; 
import { Button } from "@/components/ui/button";
import { Github, ExternalLink, Settings2, Zap, Users, Database } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const getStatusBadgeVariant = (status: KernelStatus): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "Running":
      return "default"; // Typically green/primary
    case "Stopped":
      return "secondary"; // Gray
    case "Error":
      return "destructive"; // Red
    case "Starting":
      return "outline"; // Yellowish/Orange - using outline for now as we don't have a direct yellow badge
    default:
      return "secondary";
  }
};

const getStatusColorClass = (status: KernelStatus): string => {
    switch (status) {
      case "Running":
        return "bg-green-500";
      case "Stopped":
        return "bg-gray-500";
      case "Error":
        return "bg-red-500";
      case "Starting":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
}


export function KernelList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {kernels.map((kernel) => (
        <Card key={kernel.id} className="flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="font-headline flex items-center gap-2">
                <Settings2 className="h-6 w-6 text-primary" /> 
                {kernel.name}
              </CardTitle>
              {kernel.sourceUrl && (
                <Link href={kernel.sourceUrl} target="_blank" rel="noopener noreferrer" aria-label={`${kernel.name} source link`}>
                  <Button variant="ghost" size="icon">
                    <Github className="h-5 w-5" />
                  </Button>
                </Link>
              )}
            </div>
             <div className="flex items-center space-x-2">
                <span className={cn("h-3 w-3 rounded-full", getStatusColorClass(kernel.status))} />
                <Badge variant={getStatusBadgeVariant(kernel.status)} className="font-body text-xs">
                  {kernel.status}
                </Badge>
            </div>
            {kernel.description && (
                 <CardDescription className="font-body text-sm pt-1">{kernel.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent className="flex-grow space-y-4">
            <div className="space-y-2">
                <h4 className="font-medium font-body text-sm">Supported Protocols:</h4>
                <div className="flex flex-wrap gap-2">
                    {kernel.protocols.map(p => (
                        <Badge key={p.name} variant="secondary" className="font-body">{p.label}</Badge>
                    ))}
                </div>
            </div>

            <div className="space-y-2 text-sm font-body">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Database className="h-4 w-4" />
                    <span>Data Transferred: <span className="font-semibold text-foreground">{kernel.totalDataUsedGB.toFixed(1)} GB</span></span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>Active Connections: <span className="font-semibold text-foreground">{kernel.activeConnections}</span></span>
                </div>
            </div>
            
            <div className="mt-4">
                 <p className="text-xs text-muted-foreground font-body">
                    Kernel-specific settings (e.g., DNS, routing, advanced parameters) are managed via the button below.
                    {kernel.name === "Xray-core" && " These can include configurations compatible with 3x-ui panel."}
                </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full font-body" disabled>
              <ExternalLink className="mr-2 h-4 w-4" />
              Manage Core Settings (Coming Soon)
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
