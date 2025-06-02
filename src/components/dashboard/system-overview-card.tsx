
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Cpu, HardDrive, MemoryStick, Users, Wifi, Globe, Network } from "lucide-react";
import { networkInfo, systemResources } from "./mock-data"; // These will be less used
import { mockUsers } from "@/app/users/user-data"; // For dynamic user count
import { useEffect, useState } from "react";

const ResourceItem = ({ icon: Icon, label, value, unit, progressValue, total, used, helpText }: { icon: React.ElementType, label: string, value?: number | string, unit?: string, progressValue?: number | string, total?: number | string, used?: number | string, helpText?: string }) => (
  <div className="flex flex-col gap-2 p-3 bg-card-foreground/5 rounded-lg">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-primary" />
        <span className="font-medium text-sm font-body">{label}</span>
      </div>
      {value !== undefined && <span className="text-lg font-semibold font-headline">{value}{unit}</span>}
    </div>
    {progressValue !== undefined && typeof progressValue === 'number' && ( // Check if progressValue is a number for Progress component
      <div>
        <Progress value={progressValue} aria-label={`${label} ${progressValue}%`} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{progressValue}%</span>
          {total !== undefined && used !== undefined && <span>{used}GB / {total}GB</span>}
        </div>
      </div>
    )}
     {progressValue !== undefined && typeof progressValue === 'string' && ( // Handle string case for "N/A"
      <div>
         <p className="text-sm text-muted-foreground">{progressValue}</p>
         {helpText && <p className="text-xs text-muted-foreground mt-1">{helpText}</p>}
      </div>
    )}
  </div>
);

export function SystemOverviewCard() {
  const [onlineUserCount, setOnlineUserCount] = useState(0);

  useEffect(() => {
    // In a real app, this would come from an API or state management
    setOnlineUserCount(mockUsers.filter(u => u.status === 'Active' && u.isEnabled).length);
  }, []); // Re-run if mockUsers changes, though it's static here after init

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl">System Overview</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ResourceItem icon={Cpu} label="CPU Usage" progressValue="N/A" helpText="Requires server agent" />
        <ResourceItem icon={MemoryStick} label="RAM Usage" progressValue="N/A" helpText="Requires server agent" />
        <ResourceItem icon={HardDrive} label="Storage Usage" progressValue="N/A" helpText="Requires server agent" />
        
        <ResourceItem icon={Wifi} label="Bandwidth Consumption" value="N/A" unit="" /> 
        <ResourceItem icon={Users} label="Online Users" value={onlineUserCount} />
        
        <div className="flex flex-col gap-2 p-3 bg-card-foreground/5 rounded-lg col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2">
                <Network className="h-5 w-5 text-primary" />
                <span className="font-medium text-sm font-body">System Details</span>
            </div>
            <p className="text-xs text-muted-foreground font-body">IPv4: N/A (Set by Server)</p>
            <p className="text-xs text-muted-foreground font-body">IPv6: N/A (Set by Server)</p>
            <p className="text-xs text-muted-foreground font-body">Domain: {networkInfo.domain} (Configured)</p>
        </div>
      </CardContent>
    </Card>
  );
}

    