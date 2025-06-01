
import { AppLayout } from "@/components/layout/app-layout";
import { ManagedHostsTable } from "@/components/node-plus/managed-hosts-table"; // Re-using this component

export default function HostsPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-headline font-semibold">Managed Hosts</h1>
          <p className="text-muted-foreground font-body">
            Define and configure specific host endpoints and their inbound behaviors (e.g., for Xray services).
          </p>
        </div>
        <ManagedHostsTable />
      </div>
    </AppLayout>
  );
}

    