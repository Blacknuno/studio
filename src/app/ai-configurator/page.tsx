
import { AppLayout } from "@/components/layout/app-layout";
import { ConfiguratorForm } from "@/components/ai-configurator/configurator-form";

export default function AiConfiguratorPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-headline font-semibold">AI Configuration Tool</h1>
          <p className="text-muted-foreground font-body">
            Leverage AI to find the optimal protocol configuration for your network.
          </p>
        </div>
        <ConfiguratorForm />
      </div>
    </AppLayout>
  );
}
