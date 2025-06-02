
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Cpu, HardDrive, MemoryStick, Users, Wifi, Globe, Network, Terminal, Server, Info } from "lucide-react";
import { networkInfo, systemResources, panelSoftwareStatus, osInformation } from "./mock-data"; 
import { mockUsers } from "@/app/users/user-data"; 
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
    {progressValue !== undefined && typeof progressValue === 'number' && ( 
      <div>
        <Progress value={progressValue} aria-label={`${label} ${progressValue}%`} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{progressValue}%</span>
          {total !== undefined && used !== undefined && <span>{used}GB / {total}GB</span>}
        </div>
      </div>
    )}
     {progressValue !== undefined && typeof progressValue === 'string' && ( 
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
    setOnlineUserCount(mockUsers.filter(u => u.status === 'Active' && u.isEnabled).length);
  }, [mockUsers]); 

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl">System Overview</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Hardware Resources */}
        <ResourceItem icon={Cpu} label={systemResources.cpu.label} progressValue="N/A" helpText="Requires server agent" />
        <ResourceItem icon={MemoryStick} label={systemResources.ram.label} progressValue="N/A" helpText="Requires server agent" />
        <ResourceItem icon={HardDrive} label={systemResources.storage.label} progressValue="N/A" helpText="Requires server agent" />
        
        {/* Network & Users */}
        <ResourceItem icon={Wifi} label="Bandwidth Consumption" value="N/A" unit="" helpText="Requires server integration" />
        <ResourceItem icon={Users} label="Online Users" value={onlineUserCount} />
        
        {/* Server Info & Panel Dependencies */}
        <div className="flex flex-col gap-3 p-3 bg-card-foreground/5 rounded-lg">
            <div className="flex items-center gap-2">
                <Server className="h-5 w-5 text-primary" />
                <span className="font-medium text-sm font-body">Server Information</span>
            </div>
            <p className="text-xs text-muted-foreground font-body">OS: {osInformation.name} {osInformation.version}</p>
            <p className="text-xs text-muted-foreground font-body">Kernel: {osInformation.kernel}</p>
            <p className="text-xs text-muted-foreground font-body">IPv4: N/A (Set by Server .env)</p>
            <p className="text-xs text-muted-foreground font-body">Domain: {networkInfo.domain} (Configured)</p>
        </div>
        
        <div className="flex flex-col gap-2 p-3 bg-card-foreground/5 rounded-lg md:col-span-2 lg:col-span-3">
            <div className="flex items-center gap-2 mb-1">
                <Terminal className="h-5 w-5 text-primary" />
                <span className="font-medium text-sm font-body">Panel Software Dependencies</span>
            </div>
            <ul className="space-y-1 text-xs">
            {panelSoftwareStatus.map(dep => (
                <li key={dep.name} className="flex justify-between items-center">
                    <span className="text-muted-foreground font-body">{dep.name} ({dep.version || 'N/A'}):</span>
                    <span className={`font-semibold ${dep.status.includes("Not Detected") ? 'text-red-500' : 'text-green-500'}`}>
                        {dep.status}
                    </span>
                </li>
            ))}
            </ul>
            <p className="text-xs text-muted-foreground font-body mt-1 flex items-center gap-1">
                <Info size={14} /> Statuses are illustrative mocks based on typical installation.
            </p>
        </div>
      </CardContent>
    </Card>
  );
}
