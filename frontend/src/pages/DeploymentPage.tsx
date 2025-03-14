import { useState } from 'react';

const DeploymentPage = () => {
  const [selectedAgent, setSelectedAgent] = useState<number | null>(null);
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'deploying' | 'success' | 'error'>('idle');
  const [deploymentMessage, setDeploymentMessage] = useState('');

  const savedAgents = [
    {
      id: 1,
      name: 'Market Monitor',
      description: 'Monitors cryptocurrency markets and sends alerts based on price movements.',
      lastModified: '2023-06-15',
      status: 'draft',
    },
    {
      id: 2,
      name: 'Trading Assistant',
      description: 'Analyzes market conditions and suggests optimal trading strategies.',
      lastModified: '2023-06-10',
      status: 'draft',
    },
    {
      id: 3,
      name: 'Portfolio Tracker',
      description: 'Tracks your portfolio performance and provides insights for optimization.',
      lastModified: '2023-06-05',
      status: 'deployed',
    },
  ];

  const handleDeploy = () => {
    if (!selectedAgent) return;
    
    setDeploymentStatus('deploying');
    setDeploymentMessage('Preparing agent for deployment...');
    
    // Simulate deployment process
    setTimeout(() => {
      setDeploymentMessage('Validating agent configuration...');
      
      setTimeout(() => {
        setDeploymentMessage('Connecting to Injective blockchain...');
        
        setTimeout(() => {
          setDeploymentMessage('Deploying agent to iAgent server...');
          
          setTimeout(() => {
            setDeploymentStatus('success');
            setDeploymentMessage('Agent successfully deployed to the iAgent server!');
          }, 2000);
        }, 1500);
      }, 1500);
    }, 1500);
  };

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Agent Deployment
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Deploy your AI agents to the iAgent server for Injective blockchain interaction.
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Saved Agents */}
        <div className="lg:col-span-1">
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900">Your Agents</h3>
            <p className="mt-1 text-sm text-gray-500">
              Select an agent to deploy to the blockchain.
            </p>

            <div className="mt-6 space-y-4">
              {savedAgents.map((agent) => (
                <div
                  key={agent.id}
                  className={`p-4 rounded-md border ${
                    selectedAgent === agent.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                  } cursor-pointer transition-colors`}
                  onClick={() => setSelectedAgent(agent.id)}
                >
                  <div className="flex justify-between">
                    <h4 className="text-base font-medium text-gray-900">{agent.name}</h4>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        agent.status === 'deployed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {agent.status === 'deployed' ? 'Deployed' : 'Draft'}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{agent.description}</p>
                  <p className="mt-2 text-xs text-gray-400">Last modified: {agent.lastModified}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Deployment Options */}
        <div className="lg:col-span-2">
          {selectedAgent ? (
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900">
                Deployment Options
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Configure how your agent will be deployed to the blockchain.
              </p>

              <div className="mt-6 space-y-6">
                <div>
                  <label htmlFor="network" className="block text-sm font-medium text-gray-700">
                    Network
                  </label>
                  <select
                    id="network"
                    name="network"
                    className="input mt-1"
                    defaultValue="mainnet"
                  >
                    <option value="mainnet">Injective Mainnet</option>
                    <option value="testnet">Injective Testnet</option>
                    <option value="devnet">Injective Devnet</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="gas-limit" className="block text-sm font-medium text-gray-700">
                    Gas Limit
                  </label>
                  <input
                    type="number"
                    id="gas-limit"
                    name="gas-limit"
                    className="input mt-1"
                    defaultValue="1000000"
                  />
                </div>

                <div>
                  <label htmlFor="permissions" className="block text-sm font-medium text-gray-700">
                    Agent Permissions
                  </label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center">
                      <input
                        id="permission-read"
                        name="permission-read"
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        defaultChecked
                      />
                      <label htmlFor="permission-read" className="ml-2 text-sm text-gray-700">
                        Read blockchain data
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="permission-write"
                        name="permission-write"
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        defaultChecked
                      />
                      <label htmlFor="permission-write" className="ml-2 text-sm text-gray-700">
                        Write transactions
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="permission-external"
                        name="permission-external"
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="permission-external" className="ml-2 text-sm text-gray-700">
                        Access external data sources
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    className="btn btn-primary w-full"
                    onClick={handleDeploy}
                    disabled={deploymentStatus === 'deploying'}
                  >
                    {deploymentStatus === 'deploying' ? 'Deploying...' : 'Deploy Agent'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card flex flex-col items-center justify-center py-12">
              <svg className="h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No agent selected</h3>
              <p className="mt-1 text-sm text-gray-500">
                Select an agent from the list to configure deployment options.
              </p>
            </div>
          )}

          {/* Deployment Status */}
          {deploymentStatus !== 'idle' && (
            <div className={`mt-6 card ${
              deploymentStatus === 'success' ? 'bg-green-50' :
              deploymentStatus === 'error' ? 'bg-red-50' : 'bg-blue-50'
            }`}>
              <h3 className="text-lg font-medium text-gray-900">
                Deployment Status
              </h3>
              
              <div className="mt-4">
                {deploymentStatus === 'deploying' && (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{deploymentMessage}</span>
                  </div>
                )}
                
                {deploymentStatus === 'success' && (
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{deploymentMessage}</span>
                  </div>
                )}
                
                {deploymentStatus === 'error' && (
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-red-500 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>{deploymentMessage}</span>
                  </div>
                )}
              </div>
              
              {deploymentStatus === 'success' && (
                <div className="mt-4 flex space-x-4">
                  <button type="button" className="btn btn-primary">
                    View on Explorer
                  </button>
                  <button type="button" className="btn btn-outline">
                    Manage Agent
                  </button>
                </div>
              )}
              
              {deploymentStatus === 'error' && (
                <div className="mt-4">
                  <button type="button" className="btn btn-primary">
                    Try Again
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeploymentPage; 