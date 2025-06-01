
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { kernels, type Kernel, type KernelStatus } from "@/app/users/user-data"; 
import { Button } from "@/components/ui/button";
import { Github, ExternalLink, Settings2, Users, Database, Power, RefreshCw, Play, Square, ServerIcon } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const getStatusBadgeVariant = (status: KernelStatus): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "Running": return "default"; 
    case "Stopped": return "secondary"; 
    case "Error": return "destructive"; 
    case "Starting": return "outline"; 
    case "Degraded": return "outline"; // Using "warning" equivalent
    default: return "secondary";
  }
};

const getStatusColorClass = (status: KernelStatus): string => {
    switch (status) {
      case "Running": return "bg-green-500";
      case "Stopped": return "bg-gray-500";
      case "Error": return "bg-red-500";
      case "Starting": return "bg-yellow-500"; // Often used for starting/pending
      case "Degraded": return "bg-orange-500"; // For warning/degraded
      default: return "bg-gray-500";
    }
}

export function OtherNodesTab() {
  const { toast } = useToast();
  // Filter for nodes that are not 'tor-service' and are of category 'node'
  const otherNodeServices = kernels.filter(k => k.id !== 'tor-service' && k.category === 'node');
  
  const [nodeStatuses, setNodeStatuses] = React.useState<Record<string, KernelStatus>>(
    otherNodeServices.reduce((acc, k) => ({ ...acc, [k.id]: k.status }), {})
  );

  const handleNodeAction = (nodeId: string, action: "start" | "stop" | "restart") => {
    const nodeName = otherNodeServices.find(k => k.id === nodeId)?.name || "Node";
    let newStatus: KernelStatus = nodeStatuses[nodeId];

    switch (action) {
      case "start":
        newStatus = "Running";
        break;
      case "stop":
        newStatus = "Stopped";
        break;
      case "restart":
        setNodeStatuses(prev => ({ ...prev, [nodeId]: "Starting" }));
        setTimeout(() => {
          setNodeStatuses(prev => ({ ...prev, [nodeId]: "Running" }));
          toast({
            title: `${nodeName} Restarted`,
            description: `${nodeName} has been successfully restarted (mocked).`,
          });
        }, 1500);
        return; 
    }

    setNodeStatuses(prev => ({ ...prev, [nodeId]: newStatus }));
    toast({
      title: `${nodeName} ${action === 'start' ? 'Started' : action === 'stop' ? 'Stopped' : 'Action Performed'}`,
      description: `${nodeName} has been ${action} (mocked).`,
    });
  };
  
  if (otherNodeServices.length === 0) {
    return (
        <Card>
            <CardHeader>
                 <CardTitle className="font-headline text-xl flex items-center"><ServerIcon className="mr-2 h-6 w-6 text-primary" /> Other Specialized Nodes</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground font-body text-center">No other specialized node services (like Psiphon Pro) are currently configured.</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <div className="space-y-6">
        <h2 className="text-2xl font-headline font-semibold text-center">Other Specialized Nodes</h2>
        <p className="text-muted-foreground font-body text-center mb-6">
            Manage other node-based services like Psiphon Pro.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {otherNodeServices.map((node) => (
            <Card key={node.id} className="flex flex-col">
            <CardHeader>
                <div className="flex items-center justify-between mb-2">
                <CardTitle className="font-headline flex items-center gap-2 text-lg">
                    <ServerIcon className="h-5 w-5 text-primary" /> 
                    {node.name}
                </CardTitle>
                {node.sourceUrl && (
                    <Link href={node.sourceUrl} target="_blank" rel="noopener noreferrer" aria-label={`${node.name} source link`}>
                    <Button variant="ghost" size="icon"> <Github className="h-4 w-4" /> </Button>
                    </Link>
                )}
                </div>
                <div className="flex items-center space-x-2">
                    <span className={cn("h-2.5 w-2.5 rounded-full", getStatusColorClass(nodeStatuses[node.id]))} />
                    <Badge variant={getStatusBadgeVariant(nodeStatuses[node.id])} className="font-body text-xs">
                    {nodeStatuses[node.id]}
                    </Badge>
                </div>
                {node.description && (
                    <CardDescription className="font-body text-sm pt-1 h-16 overflow-hidden text-ellipsis">{node.description}</CardDescription>
                )}
            </CardHeader>
            <CardContent className="flex-grow space-y-3">
                <div className="space-y-1">
                    <h4 className="font-medium font-body text-xs text-muted-foreground">Protocols:</h4>
                    <div className="flex flex-wrap gap-1">
                        {node.protocols.map(p => (
                            <Badge key={p.name} variant="secondary" className="font-body text-xs">{p.label}</Badge>
                        ))}
                    </div>
                </div>

                <div className="space-y-1 text-xs font-body">
                    <div className="flex items-center gap-1 text-muted-foreground">
                        <Database className="h-3 w-3" />
                        <span>Data: <span className="font-semibold text-foreground">{node.totalDataUsedGB.toFixed(1)} GB</span></span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="h-3 w-3" />
                        <span>Connections: <span className="font-semibold text-foreground">{node.activeConnections}</span></span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 pt-3">
                <div className="flex w-full gap-1.5">
                <Button variant="outline" size="sm" className="flex-1 font-body text-xs" onClick={() => handleNodeAction(node.id, "start")} disabled={nodeStatuses[node.id] === "Running" || nodeStatuses[node.id] === "Starting"}>
                    <Play className="mr-1 h-3 w-3" /> Start
                </Button>
                <Button variant="outline" size="sm" className="flex-1 font-body text-xs" onClick={() => handleNodeAction(node.id, "stop")} disabled={nodeStatuses[node.id] === "Stopped" || nodeStatuses[node.id] === "Error"}>
                    <Square className="mr-1 h-3 w-3" /> Stop
                </Button>
                <Button variant="outline" size="sm" className="flex-1 font-body text-xs" onClick={() => handleNodeAction(node.id, "restart")} disabled={nodeStatuses[node.id] === "Stopped" || nodeStatuses[node.id] === "Error" || nodeStatuses[node.id] === "Starting"}>
                    <RefreshCw className="mr-1 h-3 w-3" /> Restart
                </Button>
                </div>
                <Link href={`/kernels/${node.id}/settings`} className="w-full">
                    <Button variant="default" size="sm" className="w-full font-body text-xs">
                        <Settings2 className="mr-1 h-3 w-3" /> Manage Node Settings
                    </Button>
                </Link>
            </CardFooter>
            </Card>
        ))}
        </div>
    </div>
  );
}
