export interface VercelProjectResponse {
  id: string;
  name: string;
  accountId: string;
  createdAt: number;
  updatedAt: number;
  settings?: {
    framework?: string;
    buildCommand?: string;
    devCommand?: string;
    installCommand?: string;
    outputDirectory?: string;
  };
  targets?: Record<string, any>;
  latestDeployments?: Array<{
    id: string;
    url: string;
    state: string;
    createdAt: number;
  }>;
}

export interface VercelDomainResponse {
  id: string;
  name: string;
  projectId: string;
  status: 'pending' | 'verified' | 'failed' | 'suspended';
  configured: boolean;
  verified: boolean;
  error?: string;
  createdAt: number;
  updatedAt: number;
  dns?: {
    type: string;
    name: string;
    value: string;
  }[];
}

export interface VercelDomainConfig {
  name?: string;
  configured?: boolean;
  verified?: boolean;
}

