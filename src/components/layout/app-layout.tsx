
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Shield, UsersRound, Cpu, Settings, Server, Globe2, Share2, Power as PowerIcon, Moon, Sun, UserCircle } from "lucide-react";
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
import { useAuth } from "@/contexts/auth-context"; // Reverted to alias
import React, { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

type AppLayoutProps = {
  children: React.ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth(); 
  const { toast } = useToast();

  const [theme, setTheme] = useState("light"); 

  useEffect(() => {
    const savedTheme = typeof window !== 'undefined' ? localStorage.getItem("theme") : null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (typeof document !== 'undefined') document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme("dark");
      if (typeof document !== 'undefined') document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem("theme", newTheme);
      document.documentElement.classList.toggle("dark", newTheme === "dark");
    }
    toast({
      title: `Theme Changed to ${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)}`,
      description: "Enjoy the new look!",
    });
  };


  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      router.push("/paneladmin");
    }
  }, [auth.isLoading, auth.isAuthenticated, router]);

  // Inactivity timer is now handled within AuthContext

  if (auth.isLoading || (!auth.isLoading && !auth.isAuthenticated)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
         <p className="ml-4 font-body text-lg">Loading session...</p>
      </div>
    );
  }

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/users", label: "User Management", icon: UsersRound },
    { href: "/node-plus", label: "Node+", icon: Server },
    { href: "/hosts", label: "Hosts", icon: Globe2 },
    { href: "/server-nodes", label: "Server Nodes", icon: Share2 },
  ];

  const bottomNavItems = [
    { href: "/kernels", label: "Kernels", icon: Cpu },
    { href: "/panel-settings", label: "Panel Settings", icon: Settings },
  ];

  const handleLogout = () => {
    auth.logout(); // This will also clear the timer from within AuthContext
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };
  
  const userDisplayName = auth.user?.username ? auth.user.username.charAt(0).toUpperCase() : 'A';


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
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  className="w-full"
                  tooltip={{ children: "Logout", className: "font-body" }}
                >
                  <PowerIcon className="h-5 w-5" /> 
                  <span className="font-body">Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
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
          {/* Mobile header needs its own theme toggle and profile popover if desired, or just for desktop */}
        </header>
         <header className="sticky top-0 z-10 hidden h-14 items-center justify-end gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6 lg:flex">
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="User Profile">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://placehold.co/40x40.png" alt={auth.user?.username || "Admin"} data-ai-hint="user avatar" />
                    <AvatarFallback>{userDisplayName}</AvatarFallback>
                  </Avatar>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 mr-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium leading-none font-body">
                    {auth.user?.username || "Admin"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground font-body">
                    Login IP: 127.0.0.1 (Mock)
                  </p>
                  <Separator />
                   <Button variant="outline" size="sm" className="w-full font-body" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
