import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWalletStore } from '../store/walletStore';

const MyAgents: React.FC = () => {
  const { address } = useWalletStore();
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call to fetch user's agents
    setTimeout(() => {
      setAgents([
        {
          id: 'agent-1',
          name: 'Market Monitor',
          description: 'Monitors cryptocurrency markets and sends alerts based on price movements.',
          category: 'finance',
          status: 'active',
          created_at: '2023-05-15T10:30:00Z',
          last_active: '2023-08-10T14:22:00Z'
        },
        {
          id: 'agent-2',
          name: 'Trading Assistant',
          description: 'Helps with trading decisions by analyzing market data and trends.',
          category: 'trading',
          status: 'inactive',
          created_at: '2023-06-20T08:15:00Z',
          last_active: '2023-07-30T11:45:00Z'
        },
        {
          id: 'agent-3',
          name: 'Portfolio Tracker',
          description: 'Tracks your portfolio performance and provides insights.',
          category: 'analytics',
          status: 'active',
          created_at: '2023-07-05T16:40:00Z',
          last_active: '2023-08-09T22:10:00Z'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, [address]);
  
  const handleDeploy = (agentId: string) => {
    alert(`Deploying agent ${agentId}`);
    // In a real app, this would call the backend to deploy the agent
  };
  
  const handleToggleStatus = (agentId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    setAgents(agents.map(agent => 
      agent.id === agentId ? { ...agent, status: newStatus } : agent
    ));
    // In a real app, this would call the backend to update the agent status
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (agents.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-dark-text">My Agents</h1>
        <p className="text-gray-600 dark:text-dark-muted mb-8">You don't have any agents yet.</p>
        <Link to="/create" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
          Create Your First Agent
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text">My Agents</h1>
        <Link to="/create" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
          Create New Agent
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map(agent => (
          <div key={agent.id} className="bg-white dark:bg-dark-card rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-dark-border">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-dark-text">{agent.name}</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  agent.status === 'active' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}>
                  {agent.status}
                </span>
              </div>
              
              <p className="text-gray-600 dark:text-dark-muted mb-4 line-clamp-2">{agent.description}</p>
              
              <div className="flex items-center text-sm text-gray-500 dark:text-dark-muted mb-6">
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs font-medium mr-2">
                  {agent.category}
                </span>
                <span>
                  Created: {new Date(agent.created_at).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex space-x-2">
                <Link 
                  to={`/chat/${agent.id}`} 
                  className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Chat
                </Link>
                <button 
                  className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-secondary-600 hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500"
                  onClick={() => handleDeploy(agent.id)}
                >
                  Deploy
                </button>
                <button 
                  className={`flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-dark-border text-sm font-medium rounded-md ${
                    agent.status === 'active'
                      ? 'text-red-700 bg-white dark:bg-dark-card dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                      : 'text-green-700 bg-white dark:bg-dark-card dark:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500`}
                  onClick={() => handleToggleStatus(agent.id, agent.status)}
                >
                  {agent.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAgents; 