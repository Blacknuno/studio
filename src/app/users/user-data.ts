
export type UserStatus = 'Active' | 'Inactive' | 'Expired' | 'Banned';
export const userStatuses: UserStatus[] = ['Active', 'Inactive', 'Expired', 'Banned'];

export type KernelProtocol = {
  name: string; // e.g., "vless"
  label: string; // e.g., "VLESS"
};

export type KernelStatus = 'Running' | 'Stopped' | 'Error' | 'Starting' | 'Degraded';
export type KernelCategory = 'engine' | 'node';

export type XrayConfig = {
  logLevel: 'debug' | 'info' | 'warning' | 'error' | 'none';
  dnsServers: string[];
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
  additionalDirectives?: string;
};

export type WireGuardConfig = {
  privateKey: string;
  address: string;
  listenPort: number;
  postUp?: string;
  postDown?: string;
  dnsServers?: string[];
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
  inbounds: Array<Record<string, any>>;
  outbounds: Array<Record<string, any>>;
};

export type Country = {
  code: string;
  name: string;
  flag: string;
};

export const availableCountries: Country[] = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
];

export const filterableCountries: Country[] = [
  { code: 'IR', name: 'Iran', flag: '🇮🇷' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'KP', name: 'North Korea', flag: '🇰🇵' },
  { code: 'SY', name: 'Syria', flag: '🇸🇾' },
];


export type TorWarpFakeSiteConfig = {
  ports: number[];
  fakeDomain: string;
  selectedCountries: string[];
  enableCountrySelection: boolean;
};

export type PsiphonProConfig = {
  ports: number[];
  transportMode: 'SSH' | 'OBFUSCATED_SSH' | 'HTTP_PROXY';
  selectedCountries: string[];
  enableCountrySelection: boolean;
  customServerList?: string;
};


export type Kernel = {
  id: string;
  name: string;
  category: KernelCategory;
  sourceUrl?: string;
  protocols: KernelProtocol[];
  description?: string;
  status: KernelStatus;
  totalDataUsedGB: number;
  activeConnections: number;
  config?: XrayConfig | OpenVPNConfig | WireGuardConfig | SingBoxConfig | TorWarpFakeSiteConfig | PsiphonProConfig;
};


export const kernels: Kernel[] = [
  {
    id: "xray",
    name: "Xray-core",
    category: "engine",
    sourceUrl: "https://github.com/XTLS/Xray-core",
    description: "A platform for building proxies to bypass network restrictions. Inbounds/ports typically managed in Panel Settings.",
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
      inbounds: [], 
      outbounds: [ { tag: 'direct', protocol: 'freedom', settings: {}} ],
    } as XrayConfig,
  },
  {
    id: "openvpn",
    name: "OpenVPN",
    category: "engine",
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
      port: 1194, proto: 'udp', cipher: 'AES-256-GCM', auth: 'SHA256', dev: 'tun', serverIp: '10.8.0.1', serverNetmask: '255.255.255.0', additionalDirectives: "# Custom OpenVPN directives here"
    } as OpenVPNConfig,
  },
  {
    id: "wireguard",
    name: "WireGuard",
    category: "engine",
    sourceUrl: "https://www.wireguard.com/",
    description: "An extremely simple yet fast and modern VPN.",
    protocols: [{ name: "udp", label: "UDP" }],
    status: "Stopped",
    totalDataUsedGB: 320.5,
    activeConnections: 0,
    config: {
      privateKey: 'GENERATED_SERVER_PRIVATE_KEY', address: '10.0.0.1/24', listenPort: 51820, dnsServers: ['1.1.1.1'], peers: []
    } as WireGuardConfig,
  },
  {
    id: "sing-box",
    name: "Sing-box",
    category: "engine",
    sourceUrl: "https://github.com/SagerNet/sing-box",
    description: "A universal proxy platform with extensive protocol support.",
    protocols: [
        { name: "hysteria2", label: "Hysteria2" },
        { name: "tuic", label: "TUIC v5" },
        { name: "shadowtls", label: "ShadowTLS v3" },
        { name: "vless", label: "VLESS" },
        { name: "vmess", label: "VMess" },
    ],
    status: "Error",
    totalDataUsedGB: 50.1,
    activeConnections: 5,
    config: {
      logLevel: 'info', dns: { servers: ['1.1.1.1'] }, inbounds: [], outbounds: []
    } as SingBoxConfig,
  },
  {
    id: "tor-warp",
    name: "Tor Warp Fake Site",
    category: "node",
    sourceUrl: "https://gitlab.torproject.org/tpo/core/tor",
    description: "Routes traffic through Tor network, potentially with WARP, using a fake site SNI.",
    protocols: [{ name: "tor", label: "Tor Proxy" }],
    status: "Running",
    totalDataUsedGB: 75.3,
    activeConnections: 12,
    config: {
      ports: [9050, 9150],
      fakeDomain: "speedtest.net",
      selectedCountries: ["US", "NL"],
      enableCountrySelection: true,
    } as TorWarpFakeSiteConfig,
  },
  {
    id: "psiphon-pro",
    name: "Psiphon Pro",
    category: "node",
    sourceUrl: "https://github.com/Psiphon-Inc/psiphon",
    description: "A circumvention tool that utilizes a combination of secure communication and obfuscation technologies.",
    protocols: [{ name: "psiphon", label: "Psiphon VPN" }],
    status: "Degraded",
    totalDataUsedGB: 120.9,
    activeConnections: 25,
    config: {
      ports: [1080, 8081],
      transportMode: 'OBFUSCATED_SSH',
      selectedCountries: ["CA", "DE", "GB"],
      enableCountrySelection: true,
      customServerList: "",
    } as PsiphonProConfig,
  },
];


export type User = {
  id: string;
  username: string;
  fullName: string;
  email: string;
  status: UserStatus;
  kernelId: string; 
  kernelProfile: string; 
  protocol: string; 
  dataAllowanceGB: number;
  dataUsedGB: number;
  maxConcurrentIPs: number;
  validityPeriodDays: number;
  createdAt: string; 
  isEnabled: boolean; 
  notes?: string;
  sublinkPath?: string; 
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
    sublinkPath: 'sub_johndoe_alpha123',
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
    sublinkPath: 'sub_janesmith_beta456',
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
    dataUsedGB: 196, 
    maxConcurrentIPs: 5,
    validityPeriodDays: 365,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isEnabled: true,
    sublinkPath: 'sub_alicew_gamma789',
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
    dataUsedGB: 19.5,
    maxConcurrentIPs: 2,
    validityPeriodDays: 15,
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    isEnabled: false,
    notes: 'Subscription ended, needs renewal.',
    sublinkPath: 'sub_bob_delta001',
  },
   {
    id: 'usr_5',
    username: 'testtor',
    fullName: 'Test Tor User',
    email: 'tor.user@example.com',
    status: 'Active',
    kernelId: 'tor-warp',
    kernelProfile: 'Tor Warp Standard',
    protocol: 'tor',
    dataAllowanceGB: 50,
    dataUsedGB: 5,
    maxConcurrentIPs: 1,
    validityPeriodDays: 30,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    isEnabled: true,
    notes: 'Testing Tor Warp service.',
    sublinkPath: 'sub_tortester_zeta321',
  },
];

export function calculateExpiresOn(createdAt: string, validityPeriodDays: number): string {
  const createdDate = new Date(createdAt);
  const expiresDate = new Date(createdDate.setDate(createdDate.getDate() + validityPeriodDays));
  return expiresDate.toLocaleDateString();
}


export type XrayInboundSetting = {
  id: string;
  tag: string;
  port: number;
  protocol: 'vless' | 'vmess' | 'trojan' | 'shadowsocks' | 'http' | 'socks';
  settings: string; 
  streamSettings: string; 
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
  domainName: string;
  sslPrivateKey: string;
  sslCertificate: string;
  blockedCountries: string[];
};

export const initialPanelSettings: PanelSettingsData = {
  ipAddress: "192.168.1.100", 
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
     {
      id: "inbound_3",
      tag: "VLESS-GRPC-TLS",
      port: 2087,
      protocol: "vless",
      settings: JSON.stringify({
        clients: [{ "id": "your-grpc-uuid", "flow": "xtls-rprx-vision" }],
        decryption: "none",
      }, null, 2),
      streamSettings: JSON.stringify({
        network: "grpc",
        security: "tls",
        grpcSettings: { serviceName: "vlessgrpc" },
        tlsSettings: { serverName: "yourdomain.com" }
      }, null, 2),
      isEnabled: true,
    },
  ],
  telegramBotToken: "",
  telegramAdminChatId: "",
  isTelegramBotConnected: false,
  domainName: "my.protocolpilot.dev",
  sslPrivateKey: "-----BEGIN PRIVATE KEY-----\nMock Private Key Data...\n-----END PRIVATE KEY-----",
  sslCertificate: "-----BEGIN CERTIFICATE-----\nMock Certificate Data...\n-----END CERTIFICATE-----",
  blockedCountries: [],
};

    