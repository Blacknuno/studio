
"use client";
import { AppLayout } from "@/components/layout/app-layout";
import { ServerNodesTable } from "@/components/node-plus/server-nodes-table";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldQuestion, Globe, Route, Ghost, ServerIcon as OtherNodesIcon } from "lucide-react"; // Using ServerIcon as placeholder
import { TorServiceTab } from "@/components/node-plus/tor-service-tab";
import { WarpServiceTab } from "@/components/node-plus/warp-service-tab";
import { FakeSiteTab } from "@/components/node-plus/fake-site-tab";
import { OtherNodesTab } from "@/components/node-plus/other-nodes-tab"; // For Psiphon etc.


export default function NodePlusPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-headline font-semibold">Node+ Services & Server Nodes</h1>
          <p className="text-muted-foreground font-body">
            Manage specialized proxy services (like Tor, Warp, Fake Site) and user-defined server nodes.
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
        
        <Separator className="my-8" />
        
        <div>
          <h2 className="text-2xl font-headline font-semibold">Managed Server Nodes</h2>
          <p className="text-muted-foreground font-body mb-4">
            Add and manage your own physical or virtual server nodes that can be utilized by various services.
          </p>
        </div>
        <ServerNodesTable />

      </div>
    </AppLayout>
  );
}
