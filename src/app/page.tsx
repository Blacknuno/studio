
import { AppLayout } from "@/components/layout/app-layout";
import { SystemOverviewCard } from "@/components/dashboard/system-overview-card";
import { VersionDisplayCard } from "@/components/dashboard/version-display-card";
import { UserStatusChartCard } from "@/components/dashboard/user-status-chart-card";
import { BandwidthMonitoringCard } from "@/components/dashboard/bandwidth-monitoring-card";

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-headline font-semibold">ProtocolPilot Dashboard</h1>
          <p className="text-muted-foreground font-body">
            Welcome to your ProtocolPilot dashboard! Here's a live overview of your system.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-3">
            <SystemOverviewCard />
          </div>
          <div className="lg:col-span-1">
            <VersionDisplayCard />
          </div>
          <div className="lg:col-span-2">
            <UserStatusChartCard />
          </div>
          <div className="lg:col-span-3">
             <BandwidthMonitoringCard />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
