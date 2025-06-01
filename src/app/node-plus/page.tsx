
"use client";
import { AppLayout } from "@/components/layout/app-layout";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldQuestion, Globe, Route, Ghost, ServerIcon as OtherNodesIcon } from "lucide-react";
import { TorServiceTab } from "@/components/node-plus/tor-service-tab";
import { WarpServiceTab } from "@/components/node-plus/warp-service-tab";
import { FakeSiteTab } from "@/components/node-plus/fake-site-tab";
import { OtherNodesTab } from "@/components/node-plus/other-nodes-tab";


export default function NodePlusPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-headline font-semibold">Node+ Services</h1>
          <p className="text-muted-foreground font-body">
            Manage specialized proxy services like Tor, Warp, and Fake Site. Other specific node services are listed under "Other Nodes".
            User-defined server nodes are managed on the dedicated "Server Nodes" page.
          </p>
        </div>

        <Tabs defaultValue="tor" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2">
            <TabsTrigger value="tor" className="font-body">
              <Route className="mr-2 h-4 w-4" /> Tor Service
            </TabsTrigger>
            <TabsTrigger value="warp" className="font-body">
              <ShieldQuestion className="mr-2 h-4 w-4" /> Warp Service
            </TabsTrigger>
            <TabsTrigger value="fakesite" className="font-body">
              <Globe className="mr-2 h-4 w-4" /> Fake Site
            </TabsTrigger>
            <TabsTrigger value="othernodes" className="font-body">
                <OtherNodesIcon className="mr-2 h-4 w-4" /> Other Nodes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tor" className="mt-6">
            <TorServiceTab />
          </TabsContent>
          <TabsContent value="warp" className="mt-6">
            <WarpServiceTab />
          </TabsContent>
          <TabsContent value="fakesite" className="mt-6">
            <FakeSiteTab />
          </TabsContent>
           <TabsContent value="othernodes" className="mt-6">
            <OtherNodesTab />
          </TabsContent>
        </Tabs>
        
        {/* ServerNodesTable is now on its own page: /server-nodes */}
      </div>
    </AppLayout>
  );
}

    