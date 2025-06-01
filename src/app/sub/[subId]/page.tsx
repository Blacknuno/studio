
"use client"; 

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { mockUsers, kernels, User, calculateExpiresOn } from '@/app/users/user-data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DataUsageBar } from '@/components/users/data-usage-bar';
import { Button } from '@/components/ui/button';
import { DownloadCloud, QrCode, ShieldAlert, UserCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function UserSubscriptionPage() {
  const params = useParams();
  const subId = params.subId as string;
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (subId) {
      const foundUser = mockUsers.find(u => u.sublinkPath === subId);
      setUser(foundUser || null);
    }
    setIsLoading(false);
  }, [subId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-lg font-medium">Loading subscription details...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="items-center">
          <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
          <CardTitle className="text-2xl font-headline text-center">Subscription Not Found</CardTitle>
          <CardDescription className="text-center font-body">
            The subscription link is invalid or has expired. Please contact support.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center">
            <Link href="/">
                <Button variant="outline">Go to Homepage</Button>
            </Link>
        </CardFooter>
      </Card>
    );
  }

  const kernelInfo = kernels.find(k => k.id === user.kernelId);
  const protocolInfo = kernelInfo?.protocols.find(p => p.name === user.protocol);
  const expiresOn = calculateExpiresOn(user.createdAt, user.validityPeriodDays);
  const isExpired = new Date() > new Date(new Date(user.createdAt).setDate(new Date(user.createdAt).getDate() + user.validityPeriodDays));


  return (
    <Card className="w-full max-w-lg shadow-xl">
      <CardHeader className="text-center">
        <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
          <UserCircle className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="text-3xl font-headline">Welcome, {user.fullName}!</CardTitle>
        <CardDescription className="font-body">
          Here are your subscription details for ProtocolPilot.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="font-semibold font-headline text-lg">Account Status</h3>
          <div className="flex items-center space-x-2">
            <Badge variant={!user.isEnabled || isExpired ? 'destructive' : 'default'} className="text-sm">
              {!user.isEnabled ? 'Disabled' : isExpired ? 'Expired' : user.status}
            </Badge>
            <p className="text-sm text-muted-foreground font-body">
              {user.isEnabled && !isExpired ? `Expires on: ${expiresOn}` : user.isEnabled && isExpired ? `Expired on: ${expiresOn}` : 'Account currently disabled.'}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold font-headline text-lg">Data Usage</h3>
          <DataUsageBar used={user.dataUsedGB} allowance={user.dataAllowanceGB} />
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold font-headline text-lg">Service Configuration</h3>
          <div className="p-4 bg-muted/50 rounded-md space-y-1 font-body">
            <p><strong>Profile:</strong> {user.kernelProfile}</p>
            <p><strong>Kernel:</strong> {kernelInfo?.name || 'N/A'}</p>
            <p><strong>Protocol:</strong> {protocolInfo?.label || 'N/A'}</p>
            <p><strong>Max Concurrent IPs:</strong> {user.maxConcurrentIPs}</p>
          </div>
        </div>
        
        <div className="space-y-3 pt-2">
            <h3 className="font-semibold font-headline text-lg text-center">Get Connected</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button 
                    className="w-full font-body" 
                    onClick={() => toast({ title: "Download Configuration", description: "Mock: Configuration file download would start here."})}
                >
                    <DownloadCloud className="mr-2 h-5 w-5" /> Download Config
                </Button>
                <Button 
                    variant="outline" 
                    className="w-full font-body"
                    onClick={() => toast({ title: "Show QR Code", description: "Mock: QR code for configuration would be displayed here."})}
                >
                    <QrCode className="mr-2 h-5 w-5" /> Show QR Code
                </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center font-body pt-1">
                Use the options above to easily set up your client application.
            </p>
        </div>

      </CardContent>
      <CardFooter className="flex flex-col items-center text-center pt-6">
        <p className="text-xs text-muted-foreground font-body">
          Need help? Contact support at support@protocolpilot.dev (mock).
        </p>
        <p className="text-xs text-muted-foreground font-body mt-1">
            ProtocolPilot &copy; {new Date().getFullYear()}
        </p>
      </CardFooter>
    </Card>
  );
}
