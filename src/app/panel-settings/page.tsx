
import { AppLayout } from "@/components/layout/app-layout";
import { SystemSettingsCard } from "@/components/panel-settings/system-settings-card";
import { DomainSettingsCard } from "@/components/panel-settings/domain-settings-card";
import { XrayInboundsCard } from "@/components/panel-settings/xray-inbounds-card";
import { TelegramBotCard } from "@/components/panel-settings/telegram-bot-card";
import { CountryBlockingCard } from "@/components/panel-settings/country-blocking-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Globe, Share2, Bot, ShieldBan } from "lucide-react";


export default function PanelSettingsPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-headline font-semibold">Panel Settings</h1>
          <p className="text-muted-foreground font-body">
            Manage system configurations, protocol settings, and integrations.
          </p>
        </div>

        <Tabs defaultValue="system" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mb-6">
            <TabsTrigger value="system" className="font-body">
              <Settings className="mr-2 h-4 w-4" /> System Access
            </TabsTrigger>
            <TabsTrigger value="domain" className="font-body">
              <Globe className="mr-2 h-4 w-4" /> Domain & SSL
            </TabsTrigger>
            <TabsTrigger value="xray" className="font-body">
              <Share2 className="mr-2 h-4 w-4" /> Xray Inbounds
            </TabsTrigger>
            <TabsTrigger value="telegram" className="font-body">
              <Bot className="mr-2 h-4 w-4" /> Telegram Bot
            </TabsTrigger>
            <TabsTrigger value="geoblocking" className="font-body">
              <ShieldBan className="mr-2 h-4 w-4" /> Geo-Blocking
            </TabsTrigger>
          </TabsList>

          <TabsContent value="system">
            <SystemSettingsCard />
          </TabsContent>
          <TabsContent value="domain">
            <DomainSettingsCard />
          </TabsContent>
          <TabsContent value="xray">
            <XrayInboundsCard />
          </TabsContent>
          <TabsContent value="telegram">
            <TelegramBotCard />
          </TabsContent>
          <TabsContent value="geoblocking">
            <CountryBlockingCard />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
