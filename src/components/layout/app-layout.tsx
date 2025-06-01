
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Wand2, Shield, UsersRound, Cpu, Settings, Server, Globe2, Share2, Route, Spline as TunnelIcon } from "lucide-react"; 
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
import { useLanguage } from "@/contexts/language-context"; 
import { LanguageSwitcher } from "./language-switcher"; 

type AppLayoutProps = {
  children: React.ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const { t } = useLanguage(); 

  const navItems = [
    { href: "/", labelKey: "dashboard", icon: LayoutDashboard },
    { href: "/ai-configurator", labelKey: "ai_configurator", icon: Wand2 },
    { href: "/users", labelKey: "user_management", icon: UsersRound },
    { href: "/node-plus", labelKey: "node_plus", icon: Server },
    { href: "/hosts", labelKey: "hosts", icon: Globe2 },
    { href: "/server-nodes", labelKey: "server_nodes", icon: Share2 },
  ];

  const bottomNavItems = [
    { href: "/kernels", labelKey: "kernels", icon: Cpu },
    { href: "/panel-settings", labelKey: "panel_settings", icon: Settings },
  ];


  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarHeader className="p-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-headline font-semibold">{t('protocol_pilot')}</h1>
          </Link>
          <div className="hidden md:block"> {/* Language switcher for desktop sidebar header */}
             <LanguageSwitcher />
          </div>
        </SidebarHeader>
        <Separator />
        <SidebarContent>
          <SidebarMenu className="flex-grow">
            {navItems.map((item) => (
              <SidebarMenuItem key={item.labelKey}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    className="w-full"
                    isActive={pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))}
                    tooltip={{ children: t(item.labelKey), className: "font-body" }}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-body">{t(item.labelKey)}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          <SidebarMenu>
             <div className="mt-auto">
                <Separator className="my-2" />
                {bottomNavItems.map((item) => (
                <SidebarMenuItem key={item.labelKey}>
                    <Link href={item.href} legacyBehavior passHref>
                    <SidebarMenuButton
                        className="w-full"
                        isActive={pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))}
                        tooltip={{ children: t(item.labelKey), className: "font-body" }}
                    >
                        <item.icon className="h-5 w-5" />
                        <span className="font-body">{t(item.labelKey)}</span>
                    </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
                ))}
                <div className="px-4 py-3 text-xs text-sidebar-foreground/60 group-data-[collapsible=icon]:hidden">
                {t('system_version_mock')}
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
                <span className="sr-only">{t('toggle_navigation_menu')}</span>
              </Button>
            </SidebarTrigger>
            <Link href="/" className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-headline font-semibold">{t('protocol_pilot')}</h1>
            </Link>
          </div>
          <LanguageSwitcher /> {/* Language switcher in mobile header */}
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
