
import { AppLayout } from "@/components/layout/app-layout";
import { NodeList } from "@/components/node-plus/node-list";
import { ServerNodesTable } from "@/components/node-plus/server-nodes-table";
import { Separator } from "@/components/ui/separator";

export default function NodePlusPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-headline font-semibold">Node+ Services</h1>
          <p className="text-muted-foreground font-body">
            Manage specialized proxy services like Tor Warp and Psiphon Pro.
          </p>
        </div>
        <NodeList />

        <Separator className="my-8" />
        
        <div>
          <h2 className="text-2xl font-headline font-semibold">Managed Server Nodes</h2>
          <p className="text-muted-foreground font-body">
            Add and manage your own server nodes that can be utilized by various services.
          </p>
        </div>
        <ServerNodesTable />

      </div>
    </AppLayout>
  );
}
