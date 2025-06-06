
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
  rawConfig?: string; 
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
  rawConfig?: string;
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
  ...availableCountries 
];


export type TorKernelConfig = { 
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
  bandwidthLimitMbps?: number; 
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
  config?: XrayConfig | OpenVPNConfig | WireGuardConfig | SingBoxConfig | TorKernelConfig | PsiphonProConfig;
  isInstalled: boolean; // Added: To indicate if the core is (mock) installed
  version?: string; // Added: To store mock version
  installationPrerequisites?: string;
};


export const kernels: Kernel[] = [
  {
    id: "xray",
    name: "Xray-core",
    category: "engine",
    sourceUrl: "https://github.com/XTLS/Xray-core",
    description: "A platform for building proxies. Detailed inbound/outbound configs via Managed Hosts.",
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
    isInstalled: true,
    version: "1.8.4 (Mock)",
    config: {
      logLevel: 'info',
      dnsServers: ['1.1.1.1', '8.8.8.8'],
      rawConfig: JSON.stringify({ outbounds: [ { tag: 'direct', protocol: 'freedom', settings: {}} ] }, null, 2),
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
    isInstalled: true,
    version: "2.6.x (Mock)",
    installationPrerequisites: "Requires 'openvpn' package on server.",
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
    status: "Stopped", // Changed to Stopped to test UI for non-running but installed cores
    totalDataUsedGB: 320.5,
    activeConnections: 0,
    isInstalled: true,
    version: "1.0.x (Mock)",
    installationPrerequisites: "Requires 'wireguard' package on server.",
    config: {
      privateKey: 'GENERATED_SERVER_PRIVATE_KEY', address: '10.0.0.1/24', listenPort: 51820, dnsServers: ['1.1.1.1'], peers: []
    } as WireGuardConfig,
  },
  {
    id: "sing-box",
    name: "Sing-box",
    category: "engine",
    sourceUrl: "https://github.com/SagerNet/sing-box",
    description: "A universal proxy platform. Detailed inbound/outbound configs via Managed Hosts.",
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
    isInstalled: true,
    version: "1.8.0 (Mock)",
    config: {
      logLevel: 'info', dns: { servers: ['1.1.1.1'] }, rawConfig: JSON.stringify({ outbounds: [] }, null, 2)
    } as SingBoxConfig,
  },
  {
    id: "tor-service", 
    name: "Tor Service", 
    category: "node", 
    sourceUrl: "https://gitlab.torproject.org/tpo/core/tor",
    description: "Routes traffic through Tor network, potentially with a fake site SNI for camouflage.",
    protocols: [{ name: "tor", label: "Tor Proxy" }],
    status: "Running",
    totalDataUsedGB: 75.3,
    activeConnections: 12,
    isInstalled: true,
    version: "0.4.x (Mock)",
    config: {
      ports: [9050, 9150],
      fakeDomain: "www.bing.com", 
      selectedCountries: ["US", "NL"],
      enableCountrySelection: true,
    } as TorKernelConfig, 
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
    isInstalled: true,
    version: "Internal Build (Mock)",
    config: {
      ports: [1080, 8081],
      transportMode: 'OBFUSCATED_SSH',
      selectedCountries: ["CA", "DE", "GB"],
      enableCountrySelection: true,
      customServerList: "",
      bandwidthLimitMbps: 10, 
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
  enableTunnelSetup?: boolean;
  tunnelConfig?: {
    service: 'none' | 'tor' | 'warp' | 'psiphon';
    countries?: string[]; 
    warpLicenseKey?: string; 
  };
};

export const mockUsers: User[] = []; // Start with an empty user list

export function calculateExpiresOn(createdAt: string, validityPeriodDays: number): string {
  const createdDate = new Date(createdAt);
  const expiresDate = new Date(createdDate.setDate(createdDate.getDate() + validityPeriodDays));
  return expiresDate.toLocaleDateString();
}

export type FakeSiteSettings = {
  isEnabled: boolean;
  decoyDomain: string;
  nginxConfigSnippet: string;
  isValidated: boolean;
};

export type WarpServiceSettings = {
  isEnabled: boolean;
  licenseKey: string; 
};

export type TorServicePanelSettings = {
    isEnabled: boolean; 
};

export type ManagedHost = {
  id: string;
  name: string; 
  hostName: string; 
  address: string; 
  port: number;
  networkConfig: string; 
  streamSecurityConfig: string; 
  muxConfig: string; 
  notes?: string;
  isEnabled: boolean;
};


export type PanelSettingsData = {
  ipAddress: string; 
  loginPort: number;
  loginPath: string;
  username: string; 
  telegramBotToken: string;
  telegramAdminChatId: string;
  telegramBotUsername?: string;
  telegramAdminUsername?: string;
  isTelegramBotConnected: boolean;
  domainName: string;
  sslPrivateKey: string;
  sslCertificate: string;
  blockedCountries: string[];
  fakeSite: FakeSiteSettings;
  warpService: WarpServiceSettings;
  torServicePanel: TorServicePanelSettings;
  loginPageBackgroundImageUrl?: string; 
  kernelsConfig?: { // Added for storing default kernel configs for reset
    torService?: TorKernelConfig;
    psiphonPro?: PsiphonProConfig;
  };
};

export const DEFAULT_USERNAME_FOR_SETUP = "admin";

export const defaultInitialPanelSettings: Readonly<PanelSettingsData> = Object.freeze({
  ipAddress: "N/A (Set by server .env)", 
  loginPort: 3000, 
  loginPath: "/paneladmin", 
  username: DEFAULT_USERNAME_FOR_SETUP, 
  telegramBotToken: "",
  telegramAdminChatId: "",
  telegramBotUsername: "MyProtocolPilotBot",
  telegramAdminUsername: "admin_user",
  isTelegramBotConnected: false,
  domainName: "my.protocolpilot.dev",
  sslPrivateKey: "-----BEGIN PRIVATE KEY-----\nMock Private Key Data...\n-----END PRIVATE KEY-----",
  sslCertificate: "-----BEGIN CERTIFICATE-----\nMock Certificate Data...\n-----END CERTIFICATE-----",
  blockedCountries: [],
  fakeSite: {
    isEnabled: false,
    decoyDomain: "decoy.example.com",
    nginxConfigSnippet: `server {\n  listen 443 ssl http2;\n  listen [::]:443 ssl http2;\n  server_name decoy.example.com; # Replace with your decoy domain\n\n  ssl_certificate /etc/ssl/certs/your_fake_cert.pem; # Replace with path to your SSL cert\n  ssl_certificate_key /etc/ssl/private/your_fake_key.key; # Replace with path to your SSL key\n  ssl_protocols TLSv1.2 TLSv1.3;\n  ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;\n\n  # Recommended: Add security headers\n  add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;\n  add_header X-Content-Type-Options nosniff always;\n  add_header X-Frame-Options DENY always;\n  add_header X-XSS-Protection "1; mode=block" always;\n  # add_header Content-Security-Policy "default-src 'self'; script-src 'self'; object-src 'none'; frame-ancestors 'none';" always;\n\n  location / {\n    # Path to your static fake website files\n    root /var/www/html/fake-site; # Replace with the actual path to your fake site content\n    index index.html index.htm;\n    try_files $uri $uri/ =404;\n  }\n\n  # Optional: Custom error pages\n  error_page 404 /404.html;\n  location = /404.html {\n    internal;\n    root /var/www/html/fake-site/error_pages; # Path to custom error pages\n  }\n}`,
    isValidated: false,
  },
  warpService: {
    isEnabled: false,
    licenseKey: "", 
  },
  torServicePanel: {
      isEnabled: true, 
  },
  loginPageBackgroundImageUrl: "https://placehold.co/1920x1080.png", 
  kernelsConfig: { // Define default kernel configurations here for reset
    torService: {
      ports: [9050, 9150],
      fakeDomain: "www.bing.com",
      selectedCountries: ["US", "NL"],
      enableCountrySelection: true,
    },
    psiphonPro: {
      ports: [1080, 8081],
      transportMode: 'OBFUSCATED_SSH',
      selectedCountries: ["CA", "DE", "GB"],
      enableCountrySelection: true,
      customServerList: "",
      bandwidthLimitMbps: 10,
    },
  },
});

export let initialPanelSettings: PanelSettingsData = JSON.parse(JSON.stringify(defaultInitialPanelSettings));


export type ServerNodeStatus = 'Online' | 'Offline' | 'Error' | 'Connecting';
export type ServerNodeConnectionType = 'grpclib' | 'websocket' | 'tcp' | 'other';

export type ServerNode = {
  id: string;
  name: string;
  address: string;
  port: number;
  connectionType: ServerNodeConnectionType;
  consumptionFactor: number;
  status: ServerNodeStatus;
};

export const mockServerNodes: ServerNode[] = [
  {
    id: "node_1",
    name: "Primary GRPC Node (US-East)",
    address: "us-east.myproxy.com",
    port: 443,
    connectionType: "grpclib",
    consumptionFactor: 1.0,
    status: "Online",
  },
  {
    id: "node_2",
    name: "Backup WebSocket Node (EU-West)",
    address: "192.0.2.100",
    port: 8080,
    connectionType: "websocket",
    consumptionFactor: 1.2,
    status: "Offline",
  },
  {
    id: "node_3",
    name: "Low-Latency TCP (Asia-SG)",
    address: "sg.mycdn.network",
    port: 2052,
    connectionType: "tcp",
    consumptionFactor: 0.9,
    status: "Online",
  }
];

export const mockManagedHosts: ManagedHost[] = [
  {
    id: "host_1",
    name: "VLESS WS CDN Host",
    hostName: "cdn.mydomain.com",
    address: "104.18.32.100", 
    port: 443,
    networkConfig: JSON.stringify(
      {
        network: "ws",
        wsSettings: {
          path: "/vlesspath",
          headers: { Host: "cdn.mydomain.com" },
        },
      }, null, 2),
    streamSecurityConfig: JSON.stringify(
      {
        security: "tls",
        tlsSettings: {
          serverName: "cdn.mydomain.com",
          allowInsecure: false,
        },
      }, null, 2),
    muxConfig: JSON.stringify({ enabled: true, concurrency: 8 }, null, 2),
    notes: "Primary VLESS over WebSocket with CDN fronting.",
    isEnabled: true,
  },
  {
    id: "host_2",
    name: "Trojan gRPC Backend",
    hostName: "direct.backend.net",
    address: "172.16.0.10", 
    port: 2087,
    networkConfig: JSON.stringify(
      {
        network: "grpc",
        grpcSettings: {
          serviceName: "trojangrpc",
        },
      }, null, 2),
    streamSecurityConfig: JSON.stringify(
      {
        security: "tls",
        tlsSettings: {
          serverName: "direct.backend.net",
        },
      }, null, 2),
    muxConfig: JSON.stringify({ enabled: false }, null, 2),
    notes: "Direct Trojan gRPC service for specific applications.",
    isEnabled: false,
  },
];

export type XrayInboundSetting = { 
  id: string;
  tag: string;
  port: number;
  protocol: 'vless' | 'vmess' | 'trojan' | 'shadowsocks' | 'http' | 'socks';
  settings: string; 
  streamSettings: string; 
  isEnabled: boolean;
};
    
