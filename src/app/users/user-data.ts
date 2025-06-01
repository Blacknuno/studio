
export type UserStatus = 'Active' | 'Inactive' | 'Expired' | 'Banned';
export const userStatuses: UserStatus[] = ['Active', 'Inactive', 'Expired', 'Banned'];

export type KernelProtocol = {
  name: string; // e.g., "vless"
  label: string; // e.g., "VLESS"
};

export type KernelStatus = 'Running' | 'Stopped' | 'Error' | 'Starting';

export type XrayConfig = {
  logLevel: 'debug' | 'info' | 'warning' | 'error' | 'none';
  dnsServers: string[]; // list of DNS server IPs
  inbounds: Array<{
    tag: string;
    port: number;
    protocol: string;
    settings?: Record<string, any>;
    streamSettings?: Record<string, any>;
  }>;
  outbounds: Array<{
    tag: string;
    protocol: string;
    settings?: Record<string, any>;
  }>;
};

export type OpenVPNConfig = {
  port: number;
  proto: 'tcp' | 'udp';
  cipher: string;
  auth: string;
  dev: 'tun' | 'tap';
  serverIp: string;
  serverNetmask: string;
};

export type WireGuardConfig = {
  privateKey: string;
  address: string; // e.g. 10.0.0.1/24
  listenPort: number;
  postUp?: string;
  postDown?: string;
  peers: Array<{
    publicKey: string;
    allowedIPs: string;
    endpoint?: string;
  }>;
};

export type SingBoxConfig = {
  logLevel: 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'panic';
  dns: {
    servers: string[];
    strategy?: string;
  };
  inbounds: Array<Record<string, any>>; // Flexible for various sing-box inbound types
  outbounds: Array<Record<string, any>>;
};

export type Kernel = {
  id: string; // e.g., "xray"
  name: string; // e.g., "Xray-core"
  sourceUrl?: string;
  protocols: KernelProtocol[];
  description?: string;
  status: KernelStatus;
  totalDataUsedGB: number;
  activeConnections: number;
  config?: XrayConfig | OpenVPNConfig | WireGuardConfig | SingBoxConfig;
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
    status: "Running",
    totalDataUsedGB: 1250.7,
    activeConnections: 150,
    config: {
      logLevel: 'info',
      dnsServers: ['1.1.1.1', '8.8.8.8'],
      inbounds: [
        { tag: 'vless-in', port: 443, protocol: 'vless', settings: { clients: [], decryption: 'none'}, streamSettings: { network: 'ws', security: 'tls', wsSettings: { path: '/vless'}}},
        { tag: 'vmess-in', port: 8080, protocol: 'vmess', settings: { clients: []}, streamSettings: { network: 'tcp'}},
      ],
      outbounds: [ { tag: 'direct', protocol: 'freedom', settings: {}} ],
    } as XrayConfig,
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
    status: "Running",
    totalDataUsedGB: 870.2,
    activeConnections: 75,
    config: {
      port: 1194, proto: 'udp', cipher: 'AES-256-GCM', auth: 'SHA256', dev: 'tun', serverIp: '10.8.0.1', serverNetmask: '255.255.255.0'
    } as OpenVPNConfig,
  },
  {
    id: "wireguard",
    name: "WireGuard",
    sourceUrl: "https://www.wireguard.com/",
    description: "An extremely simple yet fast and modern VPN.",
    protocols: [{ name: "udp", label: "UDP" }],
    status: "Stopped",
    totalDataUsedGB: 320.5,
    activeConnections: 0,
    config: {
      privateKey: 'GENERATED_SERVER_PRIVATE_KEY', address: '10.0.0.1/24', listenPort: 51820, peers: []
    } as WireGuardConfig,
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
    status: "Error",
    totalDataUsedGB: 50.1,
    activeConnections: 5,
    config: {
      logLevel: 'info', dns: { servers: ['1.1.1.1'] }, inbounds: [], outbounds: []
    } as SingBoxConfig,
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


// Panel Settings Data
export type XrayInboundSetting = {
  id: string;
  tag: string;
  port: number;
  protocol: 'vless' | 'vmess' | 'trojan' | 'shadowsocks' | 'http' | 'socks';
  settings: string; // JSON string
  streamSettings: string; // JSON string
  isEnabled: boolean;
};

export type PanelSettingsData = {
  ipAddress: string;
  loginPort: number;
  loginPath: string;
  username: string;
  xrayInbounds: XrayInboundSetting[];
  telegramBotToken: string;
  telegramAdminChatId: string;
  isTelegramBotConnected: boolean;
};

export const initialPanelSettings: PanelSettingsData = {
  ipAddress: "192.168.1.100", // Mock IP
  loginPort: 2053,
  loginPath: "/paneladmin",
  username: "admin",
  xrayInbounds: [
    {
      id: "inbound_1",
      tag: "VLESS-WS-TLS",
      port: 443,
      protocol: "vless",
      settings: JSON.stringify({
        clients: [{ id: "your-uuid-here", alterId: 0, email: "user1@example.com" }],
        decryption: "none",
      }, null, 2),
      streamSettings: JSON.stringify({
        network: "ws",
        security: "tls",
        tlsSettings: { serverName: "yourdomain.com", certificates: [{ certificateFile: "/path/to/cert.pem", keyFile: "/path/to/key.pem" }] },
        wsSettings: { path: "/vless" },
      }, null, 2),
      isEnabled: true,
    },
    {
      id: "inbound_2",
      tag: "VMess-TCP",
      port: 8080,
      protocol: "vmess",
      settings: JSON.stringify({
        clients: [{ id: "another-uuid-here", alterId: 0, email: "user2@example.com" }],
      }, null, 2),
      streamSettings: JSON.stringify({
        network: "tcp",
      }, null, 2),
      isEnabled: false,
    },
  ],
  telegramBotToken: "",
  telegramAdminChatId: "",
  isTelegramBotConnected: false,
};
