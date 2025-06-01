
export type UserStatusData = {
  name: string;
  value: number;
  fill: string;
};

export const userStatusData: UserStatusData[] = [
  { name: "Active", value: 275, fill: "hsl(var(--chart-1))" },
  { name: "Inactive", value: 120, fill: "hsl(var(--chart-2))" },
  { name: "Expired", value: 45, fill: "hsl(var(--chart-3))" },
  { name: "Banned", value: 15, fill: "hsl(var(--chart-4))" },
];

export type BandwidthData = {
  date: string;
  upload: number; // in GB
  download: number; // in GB
};

export const bandwidthHistoricalData: BandwidthData[] = [
  { date: "7 days ago", upload: 150, download: 450 },
  { date: "6 days ago", upload: 180, download: 500 },
  { date: "5 days ago", upload: 200, download: 520 },
  { date: "4 days ago", upload: 190, download: 480 },
  { date: "3 days ago", upload: 210, download: 550 },
  { date: "2 days ago", upload: 230, download: 600 },
  { date: "Yesterday", upload: 220, download: 580 },
  { date: "Today", upload: 100, download: 250 }, // Partial data for today
];

export const systemResources = {
  cpu: { usage: 65, label: "CPU Usage" },
  ram: { usage: 48, total: 16, used: 7.68, label: "RAM Usage" }, // usage in %, total in GB, used in GB
  storage: { usage: 72, total: 500, used: 360, label: "Storage Usage" }, // usage in %, total in GB, used in GB
};

export const networkInfo = {
  bandwidthConsumption: 1280.5, // GB
  onlineUsers: 275,
  ipv4: "192.168.1.100",
  ipv6: "2001:0db8:85a3:0000:0000:8a2e:0370:7334",
  domain: "my.protocolpilot.dev",
};

export const versionInfo = {
  kernel: "Linux 6.1.0-17-amd64",
  protocols: [
    { name: "OpenVPN", version: "2.6.8" },
    { name: "WireGuard", version: "1.0.20210914" },
    { name: "Xray-core", version: "1.8.4" },
    { name: "Sing-box", version: "1.8.0" },
  ],
};
