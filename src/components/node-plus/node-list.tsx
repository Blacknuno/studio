
"use client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { kernels, type KernelStatus } from "@/app/users/user-data"; 
import { Button } from "@/components/ui/button";
import { Github, ExternalLink, Settings2, Zap, Users, Database, Power, RefreshCw, Play, Square, ServerIcon } from "lucide-react";
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

export function NodeList() {
  const { toast } = useToast();
  const [nodeStatuses, setNodeStatuses] = React.useState<Record<string, KernelStatus>>(
    kernels.reduce((acc, k) => ({ ...acc, [k.id]: k.status }), {})
  );

  const nodeServices = kernels.filter(k => k.category === 'node');

  const handleNodeAction = (nodeId: string, action: "start" | "stop" | "restart") => {
    const nodeName = kernels.find(k => k.id === nodeId)?.name || "Node";
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
  
  if (nodeServices.length === 0) {
    return <p className="text-muted-foreground font-body text-center">No Node+ services available.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {nodeServices.map((node) => (
        <Card key={node.id} className="flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="font-headline flex items-center gap-2">
                <ServerIcon className="h-6 w-6 text-primary" /> 
                {node.name}
              </CardTitle>
              {node.sourceUrl && (
                <Link href={node.sourceUrl} target="_blank" rel="noopener noreferrer" aria-label={`${node.name} source link`}>
                  <Button variant="ghost" size="icon">
                    <Github className="h-5 w-5" />
                  </Button>
                </Link>
              )}
            </div>
             <div className="flex items-center space-x-2">
                <span className={cn("h-3 w-3 rounded-full", getStatusColorClass(nodeStatuses[node.id]))} />
                <Badge variant={getStatusBadgeVariant(nodeStatuses[node.id])} className="font-body text-xs">
                  {nodeStatuses[node.id]}
                </Badge>
            </div>
            {node.description && (
                 <CardDescription className="font-body text-sm pt-1">{node.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent className="flex-grow space-y-4">
            <div className="space-y-2">
                <h4 className="font-medium font-body text-sm">Supported Protocols:</h4>
                <div className="flex flex-wrap gap-2">
                    {node.protocols.map(p => (
                        <Badge key={p.name} variant="secondary" className="font-body">{p.label}</Badge>
                    ))}
                </div>
            </div>

            <div className="space-y-2 text-sm font-body">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Database className="h-4 w-4" />
                    <span>Data Transferred: <span className="font-semibold text-foreground">{node.totalDataUsedGB.toFixed(1)} GB</span></span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>Active Connections: <span className="font-semibold text-foreground">{node.activeConnections}</span></span>
                </div>
            </div>
            
            <div className="mt-4">
                 <p className="text-xs text-muted-foreground font-body">
                    Node-specific settings (e.g., ports, country preferences) are managed via the button below.
                </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <div className="flex w-full gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 font-body" 
                onClick={() => handleNodeAction(node.id, "start")}
                disabled={nodeStatuses[node.id] === "Running" || nodeStatuses[node.id] === "Starting"}
              >
                <Play className="mr-2 h-4 w-4" /> Start
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 font-body" 
                onClick={() => handleNodeAction(node.id, "stop")}
                disabled={nodeStatuses[node.id] === "Stopped" || nodeStatuses[node.id] === "Error"}
              >
                <Square className="mr-2 h-4 w-4" /> Stop
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 font-body" 
                onClick={() => handleNodeAction(node.id, "restart")}
                disabled={nodeStatuses[node.id] === "Stopped" || nodeStatuses[node.id] === "Error" || nodeStatuses[node.id] === "Starting"}
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Restart
              </Button>
            </div>
            <Link href={`/kernels/${node.id}/settings`} className="w-full">
                <Button variant="default" className="w-full font-body">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Manage Node Settings
                </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

    