
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Shield, UsersRound, Cpu, Settings, Server, Globe2, Share2 } from "lucide-react"; 
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type AppLayoutProps = {
  children: React.ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    // AI Configurator removed
    { href: "/users", label: "User Management", icon: UsersRound },
    { href: "/node-plus", label: "Node+", icon: Server },
    { href: "/hosts", label: "Hosts", icon: Globe2 },
    { href: "/server-nodes", label: "Server Nodes", icon: Share2 },
  ];

  const bottomNavItems = [
    { href: "/kernels", label: "Kernels", icon: Cpu },
    { href: "/panel-settings", label: "Panel Settings", icon: Settings },
  ];


  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarHeader className="p-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-headline font-semibold">ProtocolPilot</h1>
          </Link>
        </SidebarHeader>
        <Separator />
        <SidebarContent>
          <SidebarMenu className="flex-grow">
            {navItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    className="w-full"
                    isActive={pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))}
                    tooltip={{ children: item.label, className: "font-body" }}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-body">{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          <SidebarMenu>
             <div className="mt-auto">
                <Separator className="my-2" />
                {bottomNavItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                    <Link href={item.href} legacyBehavior passHref>
                    <SidebarMenuButton
                        className="w-full"
                        isActive={pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))}
                        tooltip={{ children: item.label, className: "font-body" }}
                    >
                        <item.icon className="h-5 w-5" />
                        <span className="font-body">{item.label}</span>
                    </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
                ))}
                <div className="px-4 py-3 text-xs text-sidebar-foreground/60 group-data-[collapsible=icon]:hidden">
                System Version: 1.0.0 (Mock)
                </div>
            </div>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm md:px-6 lg:hidden">
          <div className="flex items-center gap-4">
            <SidebarTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <Shield className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SidebarTrigger>
            <Link href="/" className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-headline font-semibold">ProtocolPilot</h1>
            </Link>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

    