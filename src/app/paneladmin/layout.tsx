
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
  return (
    // The lang and dir attributes are now handled by the root layout (src/app/layout.tsx)
    // if suppressHydrationWarning is used there. For specific login page styling,
    // this html tag can remain minimal or be removed if RootLayout controls it entirely.
    // For simplicity and consistency with previous structure:
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        {children}
        <Toaster />
      </body>
    </html>
  );
}

    