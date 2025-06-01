
import { AppLayout } from "@/components/layout/app-layout";
import { SystemSettingsCard } from "@/components/panel-settings/system-settings-card";
import { XrayInboundsCard } from "@/components/panel-settings/xray-inbounds-card";
import { TelegramBotCard } from "@/components/panel-settings/telegram-bot-card";
import { Separator } from "@/components/ui/separator";

export default function PanelSettingsPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-headline font-semibold">Panel Settings</h1>
          <p className="text-muted-foreground font-body">
            Manage system configurations, protocol settings, and integrations.
          </p>
        </div>

        <SystemSettingsCard />
        <Separator />
        <XrayInboundsCard />
        <Separator />
        <TelegramBotCard />

      </div>
    </AppLayout>
  );
}
