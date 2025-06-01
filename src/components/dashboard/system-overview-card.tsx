
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Cpu, HardDrive, MemoryStick, Users, Wifi, Globe, Network } from "lucide-react";
import { networkInfo, systemResources } from "./mock-data";

const ResourceItem = ({ icon: Icon, label, value, unit, progressValue, total, used }: { icon: React.ElementType, label: string, value?: number | string, unit?: string, progressValue?: number, total?: number, used?: number }) => (
  <div className="flex flex-col gap-2 p-3 bg-card-foreground/5 rounded-lg">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-primary" />
        <span className="font-medium text-sm font-body">{label}</span>
      </div>
      {value !== undefined && <span className="text-lg font-semibold font-headline">{value}{unit}</span>}
    </div>
    {progressValue !== undefined && (
      <div>
        <Progress value={progressValue} aria-label={`${label} ${progressValue}%`} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{progressValue}%</span>
          {total !== undefined && used !== undefined && <span>{used}GB / {total}GB</span>}
        </div>
      </div>
    )}
  </div>
);

export function SystemOverviewCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl">System Overview</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ResourceItem icon={Cpu} label="CPU Usage" progressValue={systemResources.cpu.usage} />
        <ResourceItem icon={MemoryStick} label="RAM Usage" progressValue={systemResources.ram.usage} total={systemResources.ram.total} used={systemResources.ram.used} />
        <ResourceItem icon={HardDrive} label="Storage Usage" progressValue={systemResources.storage.usage} total={systemResources.storage.total} used={systemResources.storage.used} />
        
        <ResourceItem icon={Wifi} label="Bandwidth Consumption" value={networkInfo.bandwidthConsumption} unit=" GB" />
        <ResourceItem icon={Users} label="Online Users" value={networkInfo.onlineUsers} />
        
        <div className="flex flex-col gap-2 p-3 bg-card-foreground/5 rounded-lg col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2">
                <Network className="h-5 w-5 text-primary" />
                <span className="font-medium text-sm font-body">System Details</span>
            </div>
            <p className="text-xs text-muted-foreground font-body">IPv4: {networkInfo.ipv4}</p>
            <p className="text-xs text-muted-foreground font-body">IPv6: {networkInfo.ipv6}</p>
            <p className="text-xs text-muted-foreground font-body">Domain: {networkInfo.domain}</p>
        </div>
      </CardContent>
    </Card>
  );
}
