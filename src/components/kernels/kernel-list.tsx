
"use client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { kernels, type KernelStatus } from "@/app/users/user-data"; 
import { Button } from "@/components/ui/button";
import { Github, ExternalLink, Settings2, Zap, Users, Database, Power, RefreshCw, Play, Square } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import React from "react";

const getStatusBadgeVariant = (status: KernelStatus): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "Running":
      return "default"; 
    case "Stopped":
      return "secondary"; 
    case "Error":
      return "destructive"; 
    case "Starting":
      return "outline"; 
    case "Degraded":
      return "outline";
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
       case "Degraded":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
}


export function KernelList() {
  const { toast } = useToast();
  const [kernelStatuses, setKernelStatuses] = React.useState<Record<string, KernelStatus>>(
    kernels.reduce((acc, k) => ({ ...acc, [k.id]: k.status }), {})
  );

  const engineKernels = kernels.filter(k => k.category === 'engine');

  const handleKernelAction = (kernelId: string, action: "start" | "stop" | "restart") => {
    const kernelName = kernels.find(k => k.id === kernelId)?.name || "Kernel";
    let newStatus: KernelStatus = kernelStatuses[kernelId];

    switch (action) {
      case "start":
        newStatus = "Running";
        break;
      case "stop":
        newStatus = "Stopped";
        break;
      case "restart":
        // Simulate a restart sequence
        setKernelStatuses(prev => ({ ...prev, [kernelId]: "Starting" }));
        setTimeout(() => {
          setKernelStatuses(prev => ({ ...prev, [kernelId]: "Running" }));
          toast({
            title: `${kernelName} Restarted`,
            description: `${kernelName} has been successfully restarted (mocked).`,
          });
        }, 1500);
        return; 
    }

    setKernelStatuses(prev => ({ ...prev, [kernelId]: newStatus }));
    toast({
      title: `${kernelName} ${action === 'start' ? 'Started' : action === 'stop' ? 'Stopped' : 'Action Performed'}`,
      description: `${kernelName} has been ${action} (mocked).`,
    });
  };

  if (engineKernels.length === 0) {
    return <p className="text-muted-foreground font-body text-center">No kernel engines available.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {engineKernels.map((kernel) => (
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
                <span className={cn("h-3 w-3 rounded-full", getStatusColorClass(kernelStatuses[kernel.id]))} />
                <Badge variant={getStatusBadgeVariant(kernelStatuses[kernel.id])} className="font-body text-xs">
                  {kernelStatuses[kernel.id]}
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
                    Engine-specific settings (e.g., DNS, routing, advanced parameters) are managed via the button below.
                    {kernel.name === "Xray-core" && " These can include configurations compatible with 3x-ui panel."}
                </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
             <div className="flex w-full gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 font-body" 
                onClick={() => handleKernelAction(kernel.id, "start")}
                disabled={kernelStatuses[kernel.id] === "Running" || kernelStatuses[kernel.id] === "Starting"}
              >
                <Play className="mr-2 h-4 w-4" /> Start
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 font-body" 
                onClick={() => handleKernelAction(kernel.id, "stop")}
                disabled={kernelStatuses[kernel.id] === "Stopped" || kernelStatuses[kernel.id] === "Error"}
              >
                <Square className="mr-2 h-4 w-4" /> Stop
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 font-body" 
                onClick={() => handleKernelAction(kernel.id, "restart")}
                disabled={kernelStatuses[kernel.id] === "Stopped" || kernelStatuses[kernel.id] === "Error" || kernelStatuses[kernel.id] === "Starting"}
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Restart
              </Button>
            </div>
            <Link href={`/kernels/${kernel.id}/settings`} className="w-full">
                <Button variant="default" className="w-full font-body">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Manage Engine Settings
                </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

    