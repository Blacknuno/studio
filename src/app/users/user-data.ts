
export type UserStatus = 'Active' | 'Inactive' | 'Expired' | 'Banned';
export const userStatuses: UserStatus[] = ['Active', 'Inactive', 'Expired', 'Banned'];

export type KernelProtocol = {
  name: string; // e.g., "vless"
  label: string; // e.g., "VLESS"
};

export type Kernel = {
  id: string; // e.g., "xray"
  name: string; // e.g., "Xray-core"
  sourceUrl?: string;
  protocols: KernelProtocol[];
  description?: string;
};

export const kernels: Kernel[] = [
  {
    id: "xray",
    name: "Xray-core",
    sourceUrl: "https://github.com/XTLS/Xray-core",
    description: "A platform for building proxies to bypass network restrictions.",
    protocols: [
      { name: "vless", label: "VLESS" },
      { name: "vmess", label: "VMess" },
      { name: "trojan", label: "Trojan" },
      { name: "shadowsocks", label: "Shadowsocks" },
      { name: "http", label: "HTTP/HTTPS" },
      { name: "socks", label: "SOCKS5" },
    ],
  },
  {
    id: "openvpn",
    name: "OpenVPN",
    sourceUrl: "https://openvpn.net/",
    description: "A robust and highly flexible VPN protocol.",
    protocols: [
        { name: "udp", label: "UDP" },
        { name: "tcp", label: "TCP" }
    ],
  },
  {
    id: "wireguard",
    name: "WireGuard",
    sourceUrl: "https://www.wireguard.com/",
    description: "An extremely simple yet fast and modern VPN.",
    protocols: [{ name: "udp", label: "UDP" }],
  },
  {
    id: "sing-box",
    name: "Sing-box",
    sourceUrl: "https://github.com/SagerNet/sing-box",
    description: "A universal proxy platform with extensive protocol support.",
    protocols: [
        { name: "hysteria2", label: "Hysteria2" },
        { name: "tuic", label: "TUIC v5" },
        { name: "shadowtls", label: "ShadowTLS v3" },
        { name: "vless", label: "VLESS" },
        { name: "vmess", label: "VMess" },
        { name: "trojan", label: "Trojan" },
        { name: "shadowsocks", label: "Shadowsocks" },
        { name: "naive", label: "NaiveProxy" },
    ],
  },
];


export type User = {
  id: string; // uuid
  username: string;
  fullName: string;
  email: string;
  status: UserStatus;
  kernelId: string; // ID of the selected kernel
  kernelProfile: string; // Descriptive name, can be kernel.name or custom
  protocol: string; // Specific protocol string like "vless" or "udp"
  dataAllowanceGB: number;
  dataUsedGB: number;
  maxConcurrentIPs: number;
  validityPeriodDays: number;
  createdAt: string; // ISO date string
  isEnabled: boolean; // To enable/disable user
  notes?: string;
};

export const mockUsers: User[] = [
  {
    id: 'usr_1',
    username: 'johndoe',
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    status: 'Active',
    kernelId: 'wireguard',
    kernelProfile: 'WireGuard Standard',
    protocol: 'udp',
    dataAllowanceGB: 100,
    dataUsedGB: 45,
    maxConcurrentIPs: 3,
    validityPeriodDays: 30,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    isEnabled: true,
    notes: 'VIP user, prioritize support.',
  },
  {
    id: 'usr_2',
    username: 'janesmith',
    fullName: 'Jane Smith',
    email: 'jane.smith@example.com',
    status: 'Inactive',
    kernelId: 'openvpn',
    kernelProfile: 'OpenVPN Secure',
    protocol: 'tcp',
    dataAllowanceGB: 50,
    dataUsedGB: 10,
    maxConcurrentIPs: 1,
    validityPeriodDays: 90,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    isEnabled: false,
    notes: '',
  },
  {
    id: 'usr_3',
    username: 'alicew',
    fullName: 'Alice Wonderland',
    email: 'alice.w@example.com',
    status: 'Active',
    kernelId: 'xray',
    kernelProfile: 'Xray-core VLESS',
    protocol: 'vless',
    dataAllowanceGB: 200,
    dataUsedGB: 196, // Test yellow bar
    maxConcurrentIPs: 5,
    validityPeriodDays: 365,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isEnabled: true,
  },
    {
    id: 'usr_4',
    username: 'bobthebuilder',
    fullName: 'Bob Builder',
    email: 'bob.b@example.com',
    status: 'Expired',
    kernelId: 'sing-box',
    kernelProfile: 'Sing-box Hysteria',
    protocol: 'hysteria2',
    dataAllowanceGB: 20,
    dataUsedGB: 19.5, // Test red bar
    maxConcurrentIPs: 2,
    validityPeriodDays: 15,
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    isEnabled: false,
    notes: 'Subscription ended, needs renewal.',
  },
];

export function calculateExpiresOn(createdAt: string, validityPeriodDays: number): string {
  const createdDate = new Date(createdAt);
  const expiresDate = new Date(createdDate.setDate(createdDate.getDate() + validityPeriodDays));
  return expiresDate.toLocaleDateString();
}
