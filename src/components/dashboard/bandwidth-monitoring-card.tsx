
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Upload, Download, BarChartBig } from "lucide-react";
import { useState, useEffect } from "react";

export function BandwidthMonitoringCard() {
  const [liveUpload, setLiveUpload] = useState<string>("N/A");
  const [liveDownload, setLiveDownload] = useState<string>("N/A");

  // Removed useEffect that simulates live data as we are now indicating server integration is needed.

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="font-headline text-xl">Bandwidth Monitoring</CardTitle>
        <CardDescription className="font-body">Live and historical upload/download metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex flex-col items-center p-4 bg-card-foreground/5 rounded-lg">
            <div className="flex items-center gap-2 text-primary">
              <Upload className="h-6 w-6" />
              <span className="font-medium font-body">Live Upload</span>
            </div>
            <p className="text-2xl font-semibold font-headline mt-1">{liveUpload}</p>
          </div>
          <div className="flex flex-col items-center p-4 bg-card-foreground/5 rounded-lg">
            <div className="flex items-center gap-2 text-accent">
               <Download className="h-6 w-6" />
              <span className="font-medium font-body">Live Download</span>
            </div>
            <p className="text-2xl font-semibold font-headline mt-1">{liveDownload}</p>
          </div>
        </div>

        <div className="text-center py-8 px-4 border-2 border-dashed border-muted rounded-lg">
          <BarChartBig className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <h4 className="font-headline text-lg mb-1">Historical Data</h4>
          <p className="text-sm text-muted-foreground font-body">
            Real-time and historical bandwidth data requires server-side integration to collect and provide metrics.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

    