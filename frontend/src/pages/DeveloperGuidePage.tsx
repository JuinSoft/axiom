import React, { useState } from 'react';
import { FiChevronRight, FiBook, FiCode, FiBox, FiServer, FiSettings } from 'react-icons/fi';

type GuideSection = {
  title: string;
  content: React.ReactNode;
  icon: React.ReactNode;
};

const DeveloperGuidePage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');

  const sections: GuideSection[] = [
    {
      title: 'Overview',
      icon: <FiBook className="w-5 h-5" />,
      content: (
        <div>
          <h2 className="text-2xl font-bold mb-4">Getting Started with Axiom</h2>
          <p className="mb-4">
            Axiom is a no-code AI agent platform built on the Injective blockchain. This developer guide will help you understand how to build, deploy, and integrate with Axiom agents.
          </p>
          <p className="mb-4">
            This guide covers the following topics:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">Platform architecture and components</li>
            <li className="mb-2">Creating and configuring agents</li>
            <li className="mb-2">Smart contract integration</li>
            <li className="mb-2">Deployment options</li>
            <li className="mb-2">Advanced agent customization</li>
          </ul>
          <p>
            Select a section from the sidebar to learn more about each topic.
          </p>
        </div>
      )
    },
    {
      title: 'Architecture',
      icon: <FiBox className="w-5 h-5" />,
      content: (
        <div>
          <h2 className="text-2xl font-bold mb-4">Axiom Architecture</h2>
          <p className="mb-4">
            Axiom is built on a multi-layered architecture that combines blockchain-based agent registry and marketplace with a flexible execution environment.
          </p>
          <h3 className="text-xl font-semibold mb-3">Core Components</h3>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2"><span className="font-medium">Agent Registry:</span> A smart contract on Injective that stores agent metadata and configurations.</li>
            <li className="mb-2"><span className="font-medium">Agent Marketplace:</span> A decentralized marketplace for buying and selling AI agents.</li>
            <li className="mb-2"><span className="font-medium">Execution Engine:</span> The runtime environment that executes agent logic and processes user inputs.</li>
            <li className="mb-2"><span className="font-medium">Integration Layer:</span> Connectors to external services, APIs, and other blockchain networks.</li>
          </ul>
          <h3 className="text-xl font-semibold mb-3">Data Flow</h3>
          <p className="mb-4">
            When a user interacts with an agent, the request flows through these components:
          </p>
          <ol className="list-decimal pl-6 mb-4">
            <li className="mb-2">User sends a request via the frontend or API.</li>
            <li className="mb-2">The backend validates the request and retrieves the agent configuration from the registry.</li>
            <li className="mb-2">The execution engine processes the request according to the agent's capabilities.</li>
            <li className="mb-2">Any external data needed is fetched through the integration layer.</li>
            <li className="mb-2">The response is sent back to the user, and usage metrics are recorded on-chain.</li>
          </ol>
        </div>
      )
    },
    {
      title: 'Creating Agents',
      icon: <FiCode className="w-5 h-5" />,
      content: (
        <div>
          <h2 className="text-2xl font-bold mb-4">Creating Custom Agents</h2>
          <p className="mb-4">
            There are two ways to create agents on Axiom: using the no-code Design Studio or the SDK for advanced customization.
          </p>
          <h3 className="text-xl font-semibold mb-3">Using the Design Studio</h3>
          <p className="mb-4">
            The Design Studio provides a visual interface for creating agents without writing code:
          </p>
          <ol className="list-decimal pl-6 mb-4">
            <li className="mb-2">Navigate to the Design Studio in the Axiom platform.</li>
            <li className="mb-2">Define your agent's basic information (name, description, category).</li>
            <li className="mb-2">Select the capabilities you want to enable for your agent.</li>
            <li className="mb-2">Configure parameters for each capability.</li>
            <li className="mb-2">Test your agent in the sandbox environment.</li>
            <li className="mb-2">Deploy and optionally list your agent on the marketplace.</li>
          </ol>
          <h3 className="text-xl font-semibold mb-3">Using the SDK</h3>
          <p className="mb-4">
            For more advanced customization, you can use the Axiom SDK:
          </p>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto mb-4">
            <code>
{`// Example agent creation using the SDK
import { AxiomSDK } from 'axiom-sdk';

// Initialize the SDK with your API key
const axiom = new AxiomSDK('YOUR_API_KEY');

// Create a new agent
const agent = await axiom.createAgent({
  name: 'Market Analyzer',
  description: 'Analyzes market data and provides insights',
  capabilities: ['market_data', 'technical_analysis'],
  parameters: {
    update_frequency: '5m',
    data_sources: ['binance', 'coinbase', 'injective'],
  }
});

// Deploy the agent
const deployedAgent = await axiom.deployAgent(agent.id);
console.log(\`Agent deployed: \${deployedAgent.url}\`);`}
            </code>
          </pre>
        </div>
      )
    },
    {
      title: 'Smart Contracts',
      icon: <FiServer className="w-5 h-5" />,
      content: (
        <div>
          <h2 className="text-2xl font-bold mb-4">Smart Contract Integration</h2>
          <p className="mb-4">
            Axiom agents can be integrated with smart contracts on Injective and other CosmWasm-compatible chains.
          </p>
          <h3 className="text-xl font-semibold mb-3">Agent Registry Contract</h3>
          <p className="mb-4">
            The main contract for agent registration and management:
          </p>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto mb-4">
            <code>
{`// Sample interaction with Agent Registry Contract
const registryContract = "inj1ady3s7whj340xc7l3xj8zl4gzyveupn4z7yy8f";

// Register a new agent
const msg = {
  register_agent: {
    name: "Market Oracle",
    description: "Provides reliable market data",
    configuration: JSON.stringify({
      capabilities: ["price_feeds", "historical_data"],
      parameters: { /* ... */ }
    })
  }
};

// Execute the contract
const result = await executeContract(wallet, registryContract, msg);`}
            </code>
          </pre>
          <h3 className="text-xl font-semibold mb-3">Marketplace Contract</h3>
          <p className="mb-4">
            For listing and purchasing agents:
          </p>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto mb-4">
            <code>
{`// List an agent on the marketplace
const marketplaceContract = "inj1f6lmn9hcknfv2wkzh8xd5ws4wkk02npyxpnsmr";

const listMsg = {
  list_agent: {
    agent_id: "agent-123",
    price: {
      denom: "inj",
      amount: "5000000000000000000" // 5 INJ in wei
    },
    category: "finance"
  }
};

const listResult = await executeContract(wallet, marketplaceContract, listMsg);`}
            </code>
          </pre>
        </div>
      )
    },
    {
      title: 'Configuration',
      icon: <FiSettings className="w-5 h-5" />,
      content: (
        <div>
          <h2 className="text-2xl font-bold mb-4">Advanced Agent Configuration</h2>
          <p className="mb-4">
            Agents on Axiom can be highly customized through their configuration objects. This section covers advanced configuration options.
          </p>
          <h3 className="text-xl font-semibold mb-3">Configuration Structure</h3>
          <p className="mb-4">
            The complete configuration object for an agent looks like this:
          </p>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto mb-4">
            <code>
{`{
  "name": "Advanced Trading Agent",
  "description": "Sophisticated trading with multiple strategies",
  "version": "1.0.0",
  "capabilities": {
    "market_data": true,
    "technical_analysis": true,
    "sentiment_analysis": true,
    "trade_execution": true
  },
  "parameters": {
    "update_frequency": "1m",
    "risk_level": "medium",
    "max_position_size": 0.1,
    "strategies": ["momentum", "mean_reversion", "breakout"],
    "assets": ["INJ", "BTC", "ETH"]
  },
  "integrations": {
    "exchanges": ["injective", "binance"],
    "data_providers": ["coingecko", "chainlink"],
    "notification_channels": ["telegram", "email"]
  },
  "access_control": {
    "required_roles": ["trader"],
    "ip_whitelist": ["203.0.113.0/24"]
  }
}`}
            </code>
          </pre>
          <h3 className="text-xl font-semibold mb-3">Custom Logic with JavaScript</h3>
          <p className="mb-4">
            For advanced use cases, you can include custom JavaScript code in your agent:
          </p>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto mb-4">
            <code>
{`{
  "name": "Custom Logic Agent",
  "description": "Agent with custom trading logic",
  "custom_code": {
    "language": "javascript",
    "entry_point": "processMarketData",
    "source": "function processMarketData(data) { \\n  // Calculate moving averages \\n  const sma20 = calculateSMA(data.prices, 20); \\n  const sma50 = calculateSMA(data.prices, 50); \\n\\n  // Generate signals \\n  if (sma20 > sma50 && !data.position) {\\n    return { signal: 'buy', reason: 'Golden cross' };\\n  } else if (sma20 < sma50 && data.position) {\\n    return { signal: 'sell', reason: 'Death cross' };\\n  }\\n  return { signal: 'hold' };\\n}"
  }
}`}
            </code>
          </pre>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md border-l-4 border-yellow-500">
            <h4 className="text-lg font-semibold mb-2 text-yellow-800 dark:text-yellow-200">Security Notice</h4>
            <p className="text-yellow-700 dark:text-yellow-300">
              Custom code execution is sandboxed and has limited capabilities for security reasons. Certain APIs and functionality may be restricted.
            </p>
          </div>
        </div>
      )
    }
  ];

  const renderSidebar = () => {
    return (
      <div className="w-64 border-r border-gray-200 dark:border-dark-border">
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-dark-text mb-4">Developer Guide</h3>
          <ul>
            {sections.map((section) => (
              <li key={section.title.toLowerCase().replace(/\s+/g, '-')}>
                <button
                  onClick={() => setActiveSection(section.title.toLowerCase().replace(/\s+/g, '-'))}
                  className={`flex items-center w-full px-4 py-2 mb-2 text-left rounded-md ${
                    activeSection === section.title.toLowerCase().replace(/\s+/g, '-')
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-dark-text'
                  }`}
                >
                  <span className="mr-2">{section.icon}</span>
                  <span>{section.title}</span>
                  <FiChevronRight className="ml-auto w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    const section = sections.find(s => s.title.toLowerCase().replace(/\s+/g, '-') === activeSection);
    if (!section) return null;

    return (
      <div className="flex-1 p-6 overflow-auto">
        {section.content}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-dark-card shadow-md rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-dark-border">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">Axiom Developer Guide</h1>
        <p className="text-gray-600 dark:text-dark-muted">
          Technical documentation and resources for Axiom developers
        </p>
      </div>
      <div className="flex h-[800px]">
        {renderSidebar()}
        {renderContent()}
      </div>
    </div>
  );
};

export default DeveloperGuidePage; 