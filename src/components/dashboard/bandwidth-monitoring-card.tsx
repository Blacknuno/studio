
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { bandwidthHistoricalData } from "./mock-data";
import { Upload, Download } from "lucide-react";
import { useState, useEffect } from "react";

const chartConfig = {
  upload: {
    label: "Upload",
    color: "hsl(var(--chart-2))", // Using accent chart color
    icon: Upload,
  },
  download: {
    label: "Download",
    color: "hsl(var(--chart-1))", // Using primary chart color
    icon: Download,
  },
} satisfies import("@/components/ui/chart").ChartConfig;

export function BandwidthMonitoringCard() {
  const [liveUpload, setLiveUpload] = useState<string>("0 Mbps");
  const [liveDownload, setLiveDownload] = useState<string>("0 Mbps");

  useEffect(() => {
    // Simulate live data updates
    const interval = setInterval(() => {
      setLiveUpload((Math.random() * 100).toFixed(2) + " Mbps");
      setLiveDownload((Math.random() * 500).toFixed(2) + " Mbps");
    }, 2000);
    return () => clearInterval(interval);
  }, []);


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

        <h4 className="font-headline text-lg mb-2">Historical Data (Last 7 Days)</h4>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart
            data={bandwidthHistoricalData}
            margin={{
              top: 5,
              right: 20,
              left: -20, // Adjust to make Y-axis labels visible
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="date" 
              tickLine={false} 
              axisLine={false} 
              tickMargin={8} 
              tickFormatter={(value) => value.slice(0,3)}
              className="font-body text-xs"
            />
            <YAxis 
              tickLine={false} 
              axisLine={false} 
              tickMargin={8} 
              unit=" GB"
              className="font-body text-xs"
            />
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="upload"
              type="monotone"
              fill="var(--color-upload)"
              fillOpacity={0.4}
              stroke="var(--color-upload)"
              stackId="a"
            />
            <Area
              dataKey="download"
              type="monotone"
              fill="var(--color-download)"
              fillOpacity={0.4}
              stroke="var(--color-download)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
