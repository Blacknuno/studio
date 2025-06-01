
import { AppLayout } from "@/components/layout/app-layout";
import { NodeList } from "@/components/node-plus/node-list";
import { ServerNodesTable } from "@/components/node-plus/server-nodes-table";
import { ManagedHostsTable } from "@/components/node-plus/managed-hosts-table";
import { Separator } from "@/components/ui/separator";

export default function NodePlusPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-headline font-semibold">Node+ Services & Hosts</h1>
          <p className="text-muted-foreground font-body">
            Manage specialized proxy services (like Tor Warp, Psiphon Pro), user-defined server nodes, and configurable host endpoints.
          </p>
        </div>
        
        <div>
          <h2 className="text-2xl font-headline font-semibold">Specialized Node Services</h2>
           <p className="text-muted-foreground font-body mb-4">
            Services like Tor Warp and Psiphon Pro that run as distinct nodes.
          </p>
          <NodeList />
        </div>

        <Separator className="my-8" />
        
        <div>
          <h2 className="text-2xl font-headline font-semibold">Managed Server Nodes</h2>
          <p className="text-muted-foreground font-body mb-4">
            Add and manage your own physical or virtual server nodes that can be utilized by various services.
          </p>
        </div>
        <ServerNodesTable />

        <Separator className="my-8" />

        <div>
          <h2 className="text-2xl font-headline font-semibold">Managed Hosts</h2>
          <p className="text-muted-foreground font-body mb-4">
            Define and configure specific host endpoints, often used for services like Xray.
          </p>
        </div>
        <ManagedHostsTable />

      </div>
    </AppLayout>
  );
}

    