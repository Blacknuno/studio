
import type { Metadata } from 'next';
import '../globals.css'; // Ensure global styles are applied
import { Toaster } from "@/components/ui/toaster";


export const metadata: Metadata = {
  title: 'Your Subscription Details - ProtocolPilot',
  description: 'View your active subscription information and configuration details.',
};

export default function SubscriptionLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Consistent font loading with the main app */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
          {children}
        </div>
        <Toaster /> {/* Toaster for any notifications on this page */}
      </body>
    </html>
  );
}
