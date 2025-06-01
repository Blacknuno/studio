
import { AppLayout } from "@/components/layout/app-layout";
import { KernelList } from "@/components/kernels/kernel-list";

export default function KernelsPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-headline font-semibold">Kernel Engines Management</h1>
          <p className="text-muted-foreground font-body">
            View and manage core protocol engines like Xray, OpenVPN, and WireGuard.
          </p>
        </div>
        <KernelList />
      </div>
    </AppLayout>
  );
}

    