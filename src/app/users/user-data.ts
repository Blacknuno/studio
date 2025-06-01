
export type UserStatus = 'Active' | 'Inactive' | 'Expired' | 'Banned';
export const userStatuses: UserStatus[] = ['Active', 'Inactive', 'Expired', 'Banned'];

export const protocolOptions = ["OpenVPN", "WireGuard", "Xray-core", "Sing-box"];


export type User = {
  id: string; // uuid
  username: string;
  fullName: string;
  email: string;
  status: UserStatus;
  kernelProfile: string;
  protocol: string;
  dataAllowanceGB: number;
  dataUsedGB: number; // Added field for used data
  maxConcurrentIPs: number;
  validityPeriodDays: number;
  createdAt: string; // ISO date string
  notes?: string;
};

export const mockUsers: User[] = [
  {
    id: 'usr_1',
    username: 'johndoe',
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    status: 'Active',
    kernelProfile: 'High-Performance Kernel v5.4',
    protocol: 'WireGuard',
    dataAllowanceGB: 100,
    dataUsedGB: 45, // Mock used data
    maxConcurrentIPs: 3,
    validityPeriodDays: 30,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'VIP user, prioritize support.',
  },
  {
    id: 'usr_2',
    username: 'janesmith',
    fullName: 'Jane Smith',
    email: 'jane.smith@example.com',
    status: 'Inactive',
    kernelProfile: 'Standard Kernel v5.0',
    protocol: 'OpenVPN',
    dataAllowanceGB: 50,
    dataUsedGB: 10, // Mock used data
    maxConcurrentIPs: 1,
    validityPeriodDays: 90,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    notes: '',
  },
  {
    id: 'usr_3',
    username: 'alicew',
    fullName: 'Alice Wonderland',
    email: 'alice.w@example.com',
    status: 'Active',
    kernelProfile: 'Low-Latency Kernel v5.8',
    protocol: 'Xray-core',
    dataAllowanceGB: 200,
    dataUsedGB: 150, // Mock used data
    maxConcurrentIPs: 5,
    validityPeriodDays: 365,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
    {
    id: 'usr_4',
    username: 'bobthebuilder',
    fullName: 'Bob Builder',
    email: 'bob.b@example.com',
    status: 'Expired',
    kernelProfile: 'Standard Kernel v5.0',
    protocol: 'Sing-box',
    dataAllowanceGB: 20,
    dataUsedGB: 20, // Mock used data
    maxConcurrentIPs: 2,
    validityPeriodDays: 15,
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Subscription ended, needs renewal.',
  },
];

export function calculateExpiresOn(createdAt: string, validityPeriodDays: number): string {
  const createdDate = new Date(createdAt);
  const expiresDate = new Date(createdDate.setDate(createdDate.getDate() + validityPeriodDays));
  return expiresDate.toLocaleDateString();
}
