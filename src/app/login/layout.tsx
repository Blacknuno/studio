
import type { Metadata } from 'next';
import '../globals.css'; // Ensure global styles are applied
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from '@/contexts/language-context';

export const metadata: Metadata = {
  title: 'Login - ProtocolPilot',
  description: 'Login to ProtocolPilot Management Panel',
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // LanguageProvider's useEffect will set lang and dir on document.documentElement
    <html lang="en" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        <LanguageProvider>
          {children}
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
