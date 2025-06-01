
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Wand2, Shield, UsersRound, Cpu } from "lucide-react";
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

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/ai-configurator", label: "AI Configurator", icon: Wand2 },
  { href: "/users", label: "User Management", icon: UsersRound },
  { href: "/kernels", label: "Kernels", icon: Cpu },
];

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarHeader className="p-4">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-headline font-semibold">ProtocolPilot</h1>
          </Link>
        </SidebarHeader>
        <Separator />
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    className="w-full"
                    isActive={pathname === item.href}
                    tooltip={{ children: item.label, className: "font-body" }}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-body">{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6 lg:hidden">
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
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
