
import type { Metadata } from 'next';
import '../globals.css'; 
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'Login - ProtocolPilot',
  description: 'Login to ProtocolPilot Management Panel',
};

export default function PanelAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The html, head, and body tags are managed by the root layout (src/app/layout.tsx).
  // This layout should only return the content specific to the /paneladmin route.
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
