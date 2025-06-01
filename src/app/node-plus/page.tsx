
import { AppLayout } from "@/components/layout/app-layout";
import { NodeList } from "@/components/node-plus/node-list";

export default function NodePlusPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-headline font-semibold">Node+ Management</h1>
          <p className="text-muted-foreground font-body">
            Manage specialized nodes like Tor Warp and Psiphon Pro.
          </p>
        </div>
        <NodeList />
      </div>
    </AppLayout>
  );
}

    