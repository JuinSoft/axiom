import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Agent Design Studio API
export const designStudioApi = {
  generateConfig: async (name: string, description: string) => {
    const response = await api.post('/agents/generate-config', { name, description });
    return response.data;
  },
  
  saveAgent: async (config: any) => {
    const response = await api.post('/agents', config);
    return response.data;
  },
  
  getTemplates: async () => {
    const response = await api.get('/agents/templates');
    return response.data;
  },
  
  getAgentById: async (id: string) => {
    const response = await api.get(`/agents/${id}`);
    return response.data;
  },
  
  updateAgent: async (id: string, config: any) => {
    const response = await api.put(`/agents/${id}`, config);
    return response.data;
  },
  
  deployAgent: async (id: string) => {
    const response = await api.post(`/agents/${id}/deploy`);
    return response.data;
  }
};

// Marketplace API
export const marketplaceApi = {
  getAgents: async (filters?: any) => {
    const response = await api.get('/marketplace', { params: filters });
    return response.data;
  },
  
  getAgentDetails: async (id: string) => {
    const response = await api.get(`/marketplace/${id}`);
    return response.data;
  },
  
  purchaseAgent: async (id: string) => {
    const response = await api.post(`/marketplace/${id}/purchase`);
    return response.data;
  },
  
  listAgent: async (agentId: string, price: string, category: string) => {
    const response = await api.post('/marketplace', { agentId, price, category });
    return response.data;
  }
};

// Dashboard API
export const dashboardApi = {
  getAgents: async () => {
    const response = await api.get('/dashboard/agents');
    return response.data;
  },
  
  getDeployments: async () => {
    const response = await api.get('/dashboard/deployments');
    return response.data;
  },
  
  getAnalytics: async () => {
    const response = await api.get('/dashboard/analytics');
    return response.data;
  },
  
  getTransactions: async () => {
    const response = await api.get('/dashboard/transactions');
    return response.data;
  }
};

// Wallet API
export const walletApi = {
  connect: async (address: string) => {
    const response = await api.post('/wallet/connect', { address });
    return response.data;
  },
  
  getBalance: async (address: string) => {
    const response = await api.get(`/wallet/balance/${address}`);
    return response.data;
  },
  
  signMessage: async (address: string, message: string) => {
    const response = await api.post(`/wallet/${address}/sign`, { message });
    return response.data;
  }
};

export default {
  designStudioApi,
  marketplaceApi,
  dashboardApi,
  walletApi
}; 