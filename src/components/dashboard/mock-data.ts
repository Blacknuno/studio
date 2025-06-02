
import type { User } from "@/app/users/user-data"; // Import User type

export type UserStatusData = {
  name: string;
  value: number;
  fill: string;
};

// This will now be dynamically generated in UserStatusChartCard based on mockUsers
// export const userStatusData: UserStatusData[] = [
//   { name: "Active", value: 275, fill: "hsl(var(--chart-1))" },
//   { name: "Inactive", value: 120, fill: "hsl(var(--chart-2))" },
//   { name: "Expired", value: 45, fill: "hsl(var(--chart-3))" },
//   { name: "Banned", value: 15, fill: "hsl(var(--chart-4))" },
// ];

export type BandwidthData = {
  date: string;
  upload: number; // in GB
  download: number; // in GB
};

// Kept for potential future use if a mock chart is desired, but BandwidthMonitoringCard now shows a placeholder
export const bandwidthHistoricalData: BandwidthData[] = [
  { date: "7 days ago", upload: 150, download: 450 },
  { date: "6 days ago", upload: 180, download: 500 },
  { date: "5 days ago", upload: 200, download: 520 },
  { date: "4 days ago", upload: 190, download: 480 },
  { date: "3 days ago", upload: 210, download: 550 },
  { date: "2 days ago", upload: 230, download: 600 },
  { date: "Yesterday", upload: 220, download: 580 },
  { date: "Today", upload: 100, download: 250 }, 
];

// Simplified, as system resources are now indicated as "N/A (Requires Server Agent)"
export const systemResources = {
  cpu: { label: "CPU Usage" },
  ram: { label: "RAM Usage" }, 
  storage: { label: "Storage Usage" },
};

// Network info mostly for domain display, IP is server-set
export const networkInfo = {
  domain: "my.protocolpilot.dev", // This is configurable in Panel Settings
};

// This is now superseded by iterating through the `kernels` array in `user-data.ts`
// for the VersionDisplayCard.
// export const versionInfo = {
//   kernel: "Linux 6.1.0-17-amd64", // This will be shown as "OS Information: N/A (Requires server agent)"
//   protocols: [
//     { name: "OpenVPN", version: "2.6.8" },
//     { name: "WireGuard", version: "1.0.20210914" },
//     { name: "Xray-core", version: "1.8.4" },
//     { name: "Sing-box", version: "1.8.0" },
//   ],
// };

// For SystemOverviewCard to display panel software status (mock)
export const panelSoftwareStatus = [
    { name: "Node.js", status: "Detected (Mock)", version: "v18.x LTS (Mock)"},
    { name: "Nginx", status: "Detected (Mock)", version: "1.22.x (Mock)" },
    { name: "PM2", status: "Detected (Mock)", version: "5.x.x (Mock)"},
    { name: "Database (PostgreSQL/MySQL)", status: "Not Detected (Mock)", version: "N/A"},
];

export const osInformation = {
    name: "Ubuntu",
    version: "22.04 LTS (Mock)",
    kernel: "Linux 5.15.x (Mock)" // Example kernel version
};
