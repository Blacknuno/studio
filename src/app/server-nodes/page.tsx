
"use client";
import { AppLayout } from "@/components/layout/app-layout";
import { ServerNodesTable } from "@/components/server-nodes/server-nodes-table"; // Updated path

export default function ServerNodesPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-headline font-semibold">Managed Server Nodes Dashboard</h1>
          <p className="text-muted-foreground font-body">
            Unified dashboard for your server nodes. Add, manage, and monitor their status. 
            (Mock: Real-time health monitoring and automated failover controls would be managed here).
          </p>
        </div>
        <ServerNodesTable />
      </div>
    </AppLayout>
  );
}

    