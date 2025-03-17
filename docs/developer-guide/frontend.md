# Frontend Development

This document provides guidelines and information for developers working on the Axiom platform's frontend.

## Technologies

The frontend is built using the following technologies:

- **React**: JavaScript library for building user interfaces
- **TypeScript**: Typed superset of JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Routing library for React
- **React Icons**: Icon library
- **Zustand**: State management
- **Keplr Integration**: For wallet connection

## Project Structure

```
frontend/
├── node_modules/
├── public/
├── src/
│   ├── assets/        # Static assets (images, icons)
│   ├── components/    # Reusable UI components
│   ├── contexts/      # React contexts for state
│   ├── hooks/         # Custom React hooks
│   ├── pages/         # Page components
│   ├── services/      # API services
│   ├── store/         # Zustand store definitions
│   ├── types/         # TypeScript type definitions
│   ├── utils/         # Utility functions
│   ├── App.tsx        # Main application component
│   ├── index.tsx      # Entry point
│   └── ...
├── package.json
├── tsconfig.json
└── ...
```

## Key Components

### Core Components

- **Navbar**: Top navigation bar
- **Sidebar**: Side navigation menu
- **WalletConnect**: Wallet connection component
- **DarkModeToggle**: Theme switcher
- **Marketplace**: Agent marketplace components
- **AgentDesigner**: Agent design and configuration components
- **Deployment**: Agent deployment components
- **Chat**: Agent interaction components

### Pages

- **HomePage**: Landing page
- **DashboardPage**: User dashboard
- **MarketplacePage**: Browse and purchase agents
- **DesignStudioPage**: Design and configure agents
- **DeploymentPage**: Deploy agents to the blockchain
- **MyAgents**: Manage owned agents
- **AgentDetails**: View agent details
- **DeveloperGuidePage**: Interactive developer documentation
- **ApiReferencePage**: Interactive API documentation

## State Management

The application uses Zustand for state management. The main stores are:

- **walletStore**: Manages wallet connection and user authentication
- **themeStore**: Manages theme settings
- **agentStore**: Manages agent data
- **marketplaceStore**: Manages marketplace listings

Example:

```typescript
// src/store/walletStore.ts
import { create } from 'zustand';

interface WalletState {
  address: string | null;
  isConnected: boolean;
  balance: string;
  connect: () => Promise<void>;
  disconnect: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  address: null,
  isConnected: false,
  balance: '0',
  connect: async () => {
    // Connect to wallet logic
    set({ address: '...', isConnected: true });
  },
  disconnect: () => {
    set({ address: null, isConnected: false, balance: '0' });
  },
}));
```

## API Integration

The frontend communicates with the backend using a service-based approach:

```typescript
// src/services/api.ts
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authorization interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

Service example:

```typescript
// src/services/agentService.ts
import api from './api';
import { Agent, AgentConfig } from '../types';

export const getAgents = () => api.get<Agent[]>('/agents');
export const getAgentById = (id: string) => api.get<Agent>(`/agents/${id}`);
export const createAgent = (data: Partial<Agent>) => api.post<Agent>('/agents', data);
export const generateConfig = (data: any) => api.post<AgentConfig>('/agents/generate-config', data);
```

## Styling Guidelines

The application uses Tailwind CSS for styling. Follow these guidelines:

1. Use utility classes for most styling needs
2. Create custom components for complex UI elements
3. Use dark mode variants (`dark:`) for dark mode support
4. Use responsive variants for different screen sizes
5. Keep consistent spacing and sizing using Tailwind's scale

Example:

```tsx
// Example component with proper styling
const Card = ({ title, children }) => (
  <div className="bg-white dark:bg-dark-card shadow-md rounded-lg p-4 mb-4">
    <h2 className="text-xl font-semibold text-gray-800 dark:text-dark-text mb-2">{title}</h2>
    <div className="text-gray-600 dark:text-dark-muted">{children}</div>
  </div>
);
```

## Wallet Integration

The application integrates with the Keplr wallet for Injective blockchain interactions:

```typescript
// src/utils/wallet.ts
import { useWalletStore } from '../store/walletStore';

export const connectKeplr = async () => {
  if (!window.keplr) {
    alert('Please install Keplr extension');
    return;
  }

  try {
    await window.keplr.enable('injective-1');
    const offlineSigner = window.keplr.getOfflineSigner('injective-1');
    const accounts = await offlineSigner.getAccounts();
    
    const address = accounts[0].address;
    useWalletStore.getState().setWallet(address, true);
    
    return address;
  } catch (error) {
    console.error('Error connecting to Keplr:', error);
    throw error;
  }
};
```

## Best Practices

1. **Component Organization**: Keep components small and focused
2. **Type Safety**: Use TypeScript types for all components and functions
3. **Error Handling**: Implement proper error handling for API calls
4. **Loading States**: Show loading indicators during async operations
5. **Responsive Design**: Ensure the UI works on all screen sizes
6. **Accessibility**: Follow accessibility best practices
7. **Performance**: Memoize expensive calculations and components
8. **Testing**: Write tests for critical components and functions

## Development Workflow

1. **Setup**: Clone the repository and install dependencies
2. **Development**: Run the development server with `npm start`
3. **Building**: Build the production version with `npm run build`
4. **Testing**: Run tests with `npm test`

## Contributing

When contributing to the frontend:

1. Follow the established code style and patterns
2. Create new components in the appropriate directories
3. Update types when adding new features
4. Document your code with comments
5. Test your changes thoroughly before submitting a pull request 