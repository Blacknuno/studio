
"use client";
import { AppLayout } from "@/components/layout/app-layout";
import { PsiphonProSettingsCard } from "@/components/psiphon-pro/psiphon-pro-settings-card";

export default function PsiphonProPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-headline font-semibold">Psiphon Pro Management</h1>
          <p className="text-muted-foreground font-body">
            Configure and manage your Psiphon Pro service settings, including bandwidth, protocols, and geo-targeting.
          </p>
        </div>
        <PsiphonProSettingsCard />
      </div>
    </AppLayout>
  );
}

    