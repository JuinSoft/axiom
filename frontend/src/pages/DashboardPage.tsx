import { useState } from 'react';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('deployed');

  const deployedAgents = [
    {
      id: 1,
      name: 'Market Monitor',
      description: 'Monitors cryptocurrency markets and sends alerts based on price movements.',
      status: 'active',
      lastActive: '2 minutes ago',
      transactions: 1243,
      uptime: '99.8%',
    },
    {
      id: 2,
      name: 'Portfolio Tracker',
      description: 'Tracks your portfolio performance and provides insights for optimization.',
      status: 'active',
      lastActive: '5 minutes ago',
      transactions: 876,
      uptime: '99.5%',
    },
  ];

  const draftAgents = [
    {
      id: 3,
      name: 'Trading Assistant',
      description: 'Analyzes market conditions and suggests optimal trading strategies.',
      lastModified: '2025-06-10',
      completionStatus: '80%',
    },
    {
      id: 4,
      name: 'DeFi Yield Optimizer',
      description: 'Maximizes your DeFi yields with automated portfolio rebalancing.',
      lastModified: '2025-06-08',
      completionStatus: '60%',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      agent: 'Market Monitor',
      action: 'Alert Triggered',
      details: 'BTC price dropped below $40,000',
      timestamp: '2025-06-15 14:32:45',
    },
    {
      id: 2,
      agent: 'Portfolio Tracker',
      action: 'Report Generated',
      details: 'Weekly portfolio performance report',
      timestamp: '2025-06-15 12:00:00',
    },
    {
      id: 3,
      agent: 'Market Monitor',
      action: 'Data Fetched',
      details: 'Updated market data from external API',
      timestamp: '2025-06-15 11:30:00',
    },
    {
      id: 4,
      agent: 'Portfolio Tracker',
      action: 'Transaction Detected',
      details: 'New transaction detected in wallet',
      timestamp: '2025-06-15 10:15:22',
    },
  ];

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Monitor and manage your AI agents on the Injective blockchain.
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link to="/design-studio" className="btn btn-primary">
            Create New Agent
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card bg-white overflow-hidden">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Agents
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {deployedAgents.length + draftAgents.length}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-white overflow-hidden">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Agents
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {deployedAgents.filter(a => a.status === 'active').length}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-white overflow-hidden">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pending Agents
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {draftAgents.length}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-white overflow-hidden">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Transactions
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {deployedAgents.reduce((sum, agent) => sum + agent.transactions, 0)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Agents List */}
      <div className="mt-8">
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">Select a tab</label>
          <select
            id="tabs"
            name="tabs"
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
          >
            <option value="deployed">Deployed Agents</option>
            <option value="drafts">Draft Agents</option>
          </select>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                className={`${
                  activeTab === 'deployed'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('deployed')}
              >
                Deployed Agents
              </button>
              <button
                className={`${
                  activeTab === 'drafts'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('drafts')}
              >
                Draft Agents
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'deployed' && (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {deployedAgents.map((agent) => (
              <div key={agent.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium text-gray-900">{agent.name}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    agent.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {agent.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">{agent.description}</p>
                
                <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Last Active</div>
                    <div className="font-medium">{agent.lastActive}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Transactions</div>
                    <div className="font-medium">{agent.transactions}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Uptime</div>
                    <div className="font-medium">{agent.uptime}</div>
                  </div>
                </div>
                
                <div className="mt-5 flex space-x-3">
                  <button type="button" className="btn btn-outline text-sm flex-1">
                    View Details
                  </button>
                  <button type="button" className="btn btn-outline text-sm flex-1">
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'drafts' && (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {draftAgents.map((agent) => (
              <div key={agent.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium text-gray-900">{agent.name}</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Draft
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">{agent.description}</p>
                
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Last Modified</div>
                    <div className="font-medium">{agent.lastModified}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Completion</div>
                    <div className="font-medium">{agent.completionStatus}</div>
                  </div>
                </div>
                
                <div className="mt-5 flex space-x-3">
                  <Link to="/design-studio" className="btn btn-primary text-sm flex-1">
                    Continue Editing
                  </Link>
                  <Link to="/deployment" className="btn btn-outline text-sm flex-1">
                    Deploy
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="mt-12">
        <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                  Agent
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Action
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Details
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {recentActivity.map((activity) => (
                <tr key={activity.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {activity.agent}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {activity.action}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {activity.details}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {activity.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 