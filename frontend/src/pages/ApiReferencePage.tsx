import React, { useState } from 'react';
import { FiChevronRight, FiCode, FiUser, FiPackage, FiShoppingBag, FiAward, FiServer } from 'react-icons/fi';

type ApiSection = {
  title: string;
  content: React.ReactNode;
  icon: React.ReactNode;
};

const ApiReferencePage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('introduction');

  const sections: ApiSection[] = [
    {
      title: 'Introduction',
      icon: <FiCode className="w-5 h-5" />,
      content: (
        <div>
          <h2 className="text-2xl font-bold mb-4">Axiom API Reference</h2>
          <p className="mb-4">
            The Axiom API allows you to programmatically interact with the platform, manage agents, and integrate agent capabilities into your applications.
          </p>
          <h3 className="text-xl font-semibold mb-3">Base URL</h3>
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md font-mono mb-4">
            https://api.axiom.network/v1
          </div>
          <h3 className="text-xl font-semibold mb-3">Authentication</h3>
          <p className="mb-4">
            All API requests require authentication using an API key. You can obtain your API key from the Axiom dashboard.
          </p>
          <p className="mb-4">
            Include your API key in the request headers:
          </p>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto mb-4">
            <code>
{`Authorization: Bearer YOUR_API_KEY`}
            </code>
          </pre>
          <h3 className="text-xl font-semibold mb-3">Rate Limits</h3>
          <p className="mb-4">
            The API has the following rate limits:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">Free tier: 100 requests per minute</li>
            <li className="mb-2">Pro tier: 1,000 requests per minute</li>
            <li className="mb-2">Enterprise tier: Custom limits</li>
          </ul>
          <p>
            The API returns HTTP 429 (Too Many Requests) when rate limits are exceeded.
          </p>
        </div>
      )
    },
    {
      title: 'Authentication',
      icon: <FiUser className="w-5 h-5" />,
      content: (
        <div>
          <h2 className="text-2xl font-bold mb-4">Authentication</h2>
          <p className="mb-4">
            Authentication for the Axiom API uses JSON Web Tokens (JWT). There are two ways to authenticate:
          </p>
          <h3 className="text-xl font-semibold mb-3">API Key Authentication</h3>
          <p className="mb-4">
            Include your API key in the request headers:
          </p>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto mb-4">
            <code>
{`curl -X GET "https://api.axiom.network/v1/agents" \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
            </code>
          </pre>
          <h3 className="text-xl font-semibold mb-3">Wallet Authentication</h3>
          <p className="mb-4">
            For blockchain interactions, you can authenticate using your wallet:
          </p>
          <ol className="list-decimal pl-6 mb-4">
            <li className="mb-2">
              <span className="font-medium">Request a nonce:</span>
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto mb-2 mt-2">
                <code>
{`POST /auth/nonce
{
  "address": "inj1ady3s7whj340xc7l3xj8zl4gzyveupn4z7yy8f"
}`}
                </code>
              </pre>
            </li>
            <li className="mb-2">
              <span className="font-medium">Sign the nonce with your wallet</span>
            </li>
            <li className="mb-2">
              <span className="font-medium">Exchange the signature for a JWT:</span>
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto mb-2 mt-2">
                <code>
{`POST /auth/login
{
  "address": "inj1ady3s7whj340xc7l3xj8zl4gzyveupn4z7yy8f",
  "signature": "0x1234...",
  "nonce": "abcd1234..."
}`}
                </code>
              </pre>
            </li>
          </ol>
          <h3 className="text-xl font-semibold mb-3">Response</h3>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto mb-4">
            <code>
{`{
  "token": "eyJhbGci...",
  "expires_at": "2025-12-31T23:59:59Z"
}`}
            </code>
          </pre>
        </div>
      )
    },
    {
      title: 'Agents API',
      icon: <FiPackage className="w-5 h-5" />,
      content: (
        <div>
          <h2 className="text-2xl font-bold mb-4">Agents API</h2>
          <p className="mb-4">
            The Agents API allows you to create, manage, and interact with AI agents.
          </p>
          
          <div className="border-b border-gray-200 dark:border-dark-border pb-6 mb-6">
            <h3 className="text-xl font-semibold mb-3">List Agents</h3>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto mb-4">
              <code>
{`GET /agents

// Query parameters
// owner (optional): Filter by owner address
// status (optional): Filter by status (active, inactive)
// category (optional): Filter by category`}
              </code>
            </pre>
            <h4 className="text-lg font-medium mb-2">Response</h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto mb-4">
              <code>
{`{
  "agents": [
    {
      "id": "agent-123",
      "name": "Market Oracle",
      "description": "Provides reliable market data",
      "owner": "inj1ady3s7whj340xc7l3xj8zl4gzyveupn4z7yy8f",
      "category": "finance",
      "status": "active",
      "created_at": "2025-06-15T10:00:00Z"
    },
    {
      "id": "agent-456",
      "name": "Portfolio Tracker",
      "description": "Tracks portfolio performance",
      "owner": "inj1ady3s7whj340xc7l3xj8zl4gzyveupn4z7yy8f",
      "category": "analytics",
      "status": "inactive",
      "created_at": "2025-07-20T14:30:00Z"
    }
  ],
  "pagination": {
    "total": 2,
    "page": 1,
    "limit": 10
  }
}`}
              </code>
            </pre>
          </div>
          
          <div className="border-b border-gray-200 dark:border-dark-border pb-6 mb-6">
            <h3 className="text-xl font-semibold mb-3">Get Agent</h3>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto mb-4">
              <code>
{`GET /agents/{agent_id}`}
              </code>
            </pre>
            <h4 className="text-lg font-medium mb-2">Response</h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto mb-4">
              <code>
{`{
  "id": "agent-123",
  "name": "Market Oracle",
  "description": "Provides reliable market data",
  "owner": "inj1ady3s7whj340xc7l3xj8zl4gzyveupn4z7yy8f",
  "category": "finance",
  "status": "active",
  "created_at": "2025-06-15T10:00:00Z",
  "configuration": {
    "capabilities": {
      "market_data": true,
      "price_alerts": true
    },
    "parameters": {
      "update_frequency": "1m",
      "sources": ["binance", "injective"]
    }
  }
}`}
              </code>
            </pre>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-3">Create Agent</h3>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto mb-4">
              <code>
{`POST /agents

// Request body
{
  "name": "Custom Agent",
  "description": "My custom agent description",
  "category": "trading",
  "configuration": {
    "capabilities": {
      "market_data": true,
      "technical_analysis": true
    },
    "parameters": {
      "update_frequency": "5m",
      "assets": ["INJ", "BTC", "ETH"]
    }
  }
}`}
              </code>
            </pre>
            <h4 className="text-lg font-medium mb-2">Response</h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto mb-4">
              <code>
{`{
  "id": "agent-789",
  "name": "Custom Agent",
  "description": "My custom agent description",
  "owner": "inj1ady3s7whj340xc7l3xj8zl4gzyveupn4z7yy8f",
  "category": "trading",
  "status": "active",
  "created_at": "2025-08-25T09:15:00Z",
  "configuration": {
    "capabilities": {
      "market_data": true,
      "technical_analysis": true
    },
    "parameters": {
      "update_frequency": "5m",
      "assets": ["INJ", "BTC", "ETH"]
    }
  }
}`}
              </code>
            </pre>
          </div>
        </div>
      )
    },
    {
      title: 'Marketplace API',
      icon: <FiShoppingBag className="w-5 h-5" />,
      content: (
        <div>
          <h2 className="text-2xl font-bold mb-4">Marketplace API</h2>
          <p className="mb-4">
            The Marketplace API allows you to browse, purchase, and list agents on the Axiom marketplace.
          </p>
          
          <div className="border-b border-gray-200 dark:border-dark-border pb-6 mb-6">
            <h3 className="text-xl font-semibold mb-3">List Marketplace Listings</h3>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto mb-4">
              <code>
{`GET /marketplace

// Query parameters
// category (optional): Filter by category
// price_min (optional): Minimum price in INJ
// price_max (optional): Maximum price in INJ
// sort_by (optional): Sort by price, rating, created_at
// sort_dir (optional): asc or desc`}
              </code>
            </pre>
            <h4 className="text-lg font-medium mb-2">Response</h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto mb-4">
              <code>
{`{
  "listings": [
    {
      "id": "listing-123",
      "agent_id": "agent-456",
      "name": "Market Sentinel",
      "description": "Advanced market monitoring",
      "category": "finance",
      "price": "5.0",
      "currency": "INJ",
      "seller": "inj1ady3s7whj340xc7l3xj8zl4gzyveupn4z7yy8f",
      "rating": 4.8,
      "downloads": 125,
      "created_at": "2025-06-20T11:30:00Z"
    },
    {
      "id": "listing-456",
      "agent_id": "agent-789",
      "name": "Trading Assistant",
      "description": "AI-powered trading recommendations",
      "category": "trading",
      "price": "10.0",
      "currency": "INJ",
      "seller": "inj1f6lmn9hcknfv2wkzh8xd5ws4wkk02npyxpnsmr",
      "rating": 4.6,
      "downloads": 87,
      "created_at": "2025-07-15T09:45:00Z"
    }
  ],
  "pagination": {
    "total": 2,
    "page": 1,
    "limit": 10
  }
}`}
              </code>
            </pre>
          </div>
          
          <div className="border-b border-gray-200 dark:border-dark-border pb-6 mb-6">
            <h3 className="text-xl font-semibold mb-3">Get Listing Details</h3>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto mb-4">
              <code>
{`GET /marketplace/{listing_id}`}
              </code>
            </pre>
            <h4 className="text-lg font-medium mb-2">Response</h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto mb-4">
              <code>
{`{
  "id": "listing-123",
  "agent_id": "agent-456",
  "name": "Market Sentinel",
  "description": "Advanced market monitoring with customizable alerts",
  "category": "finance",
  "price": "5.0",
  "currency": "INJ",
  "seller": "inj1ady3s7whj340xc7l3xj8zl4gzyveupn4z7yy8f",
  "rating": 4.8,
  "downloads": 125,
  "created_at": "2025-06-20T11:30:00Z",
  "capabilities": [
    "market_data",
    "price_alerts",
    "technical_analysis"
  ],
  "reviews": [
    {
      "user": "inj1xyz789",
      "rating": 5,
      "comment": "Excellent agent, very accurate alerts!",
      "date": "2025-07-10T15:20:00Z"
    }
  ]
}`}
              </code>
            </pre>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-3">Purchase Agent</h3>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto mb-4">
              <code>
{`POST /marketplace/{listing_id}/purchase

// Request body is empty, authorization header is used to identify the buyer`}
              </code>
            </pre>
            <h4 className="text-lg font-medium mb-2">Response</h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto mb-4">
              <code>
{`{
  "purchase_id": "purchase-123",
  "listing_id": "listing-123",
  "agent_id": "agent-456",
  "price": "5.0",
  "currency": "INJ",
  "buyer": "inj1abc123",
  "seller": "inj1ady3s7whj340xc7l3xj8zl4gzyveupn4z7yy8f",
  "transaction_hash": "0x1234567890abcdef",
  "status": "completed",
  "timestamp": "2025-08-25T14:30:00Z"
}`}
              </code>
            </pre>
          </div>
        </div>
      )
    },
    {
      title: 'Chat API',
      icon: <FiAward className="w-5 h-5" />,
      content: (
        <div>
          <h2 className="text-2xl font-bold mb-4">Chat API</h2>
          <p className="mb-4">
            The Chat API allows users to interact with agents through natural language conversations.
          </p>
          
          <div className="border-b border-gray-200 dark:border-dark-border pb-6 mb-6">
            <h3 className="text-xl font-semibold mb-3">Send Message</h3>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto mb-4">
              <code>
{`POST /agents/{agent_id}/chat

// Request body
{
  "message": "What's the current price of INJ?",
  "conversation_id": "conv-123" // Optional, for continuing an existing conversation
}`}
              </code>
            </pre>
            <h4 className="text-lg font-medium mb-2">Response</h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto mb-4">
              <code>
{`{
  "response": "The current price of INJ is $15.42, up 2.3% in the last 24 hours.",
  "conversation_id": "conv-456",
  "timestamp": "2025-08-25T14:35:00Z",
  "metadata": {
    "data_sources": ["coingecko", "binance"],
    "confidence": 0.98
  }
}`}
              </code>
            </pre>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-3">Get Conversation History</h3>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto mb-4">
              <code>
{`GET /agents/{agent_id}/chat/{conversation_id}`}
              </code>
            </pre>
            <h4 className="text-lg font-medium mb-2">Response</h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto mb-4">
              <code>
{`{
  "conversation_id": "conv-456",
  "agent_id": "agent-123",
  "messages": [
    {
      "role": "user",
      "content": "What's the current price of INJ?",
      "timestamp": "2025-08-25T14:30:00Z"
    },
    {
      "role": "agent",
      "content": "The current price of INJ is $15.42, up 2.3% in the last 24 hours.",
      "timestamp": "2025-08-25T14:30:05Z",
      "metadata": {
        "data_sources": ["coingecko", "binance"],
        "confidence": 0.98
      }
    },
    {
      "role": "user",
      "content": "What about BTC?",
      "timestamp": "2025-08-25T14:31:00Z"
    },
    {
      "role": "agent",
      "content": "Bitcoin (BTC) is currently trading at $26,483.21, down 1.2% over the last 24 hours.",
      "timestamp": "2025-08-25T14:31:05Z",
      "metadata": {
        "data_sources": ["coingecko", "binance"],
        "confidence": 0.99
      }
    }
  ]
}`}
              </code>
            </pre>
          </div>
        </div>
      )
    },
    {
      title: 'Webhooks',
      icon: <FiServer className="w-5 h-5" />,
      content: (
        <div>
          <h2 className="text-2xl font-bold mb-4">Webhooks</h2>
          <p className="mb-4">
            Webhooks allow you to receive real-time notifications when certain events occur in the Axiom platform.
          </p>
          
          <h3 className="text-xl font-semibold mb-3">Setting Up Webhooks</h3>
          <p className="mb-4">
            To set up a webhook, you need to register an endpoint URL that will receive webhook events.
          </p>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto mb-4">
            <code>
{`POST /webhooks

// Request body
{
  "url": "https://your-server.com/webhook",
  "events": [
    "agent.created",
    "agent.updated",
    "agent.deployed",
    "marketplace.purchase"
  ],
  "secret": "your-webhook-secret" // Optional, for verifying webhook signatures
}`}
            </code>
          </pre>
          <h4 className="text-lg font-medium mb-2">Response</h4>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto mb-4">
            <code>
{`{
  "id": "webhook-123",
  "url": "https://your-server.com/webhook",
  "events": [
    "agent.created",
    "agent.updated",
    "agent.deployed",
    "marketplace.purchase"
  ],
  "created_at": "2025-08-25T15:00:00Z"
}`}
            </code>
          </pre>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Webhook Events</h3>
          <p className="mb-4">
            Webhook payloads include the event type and relevant data.
          </p>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto mb-4">
            <code>
{`// Example webhook payload for agent.created event
{
  "event": "agent.created",
  "timestamp": "2025-08-25T15:05:00Z",
  "data": {
    "agent_id": "agent-123",
    "name": "Market Oracle",
    "description": "Provides reliable market data",
    "owner": "inj1ady3s7whj340xc7l3xj8zl4gzyveupn4z7yy8f",
    "category": "finance",
    "status": "active",
    "created_at": "2025-08-25T15:05:00Z"
  }
}`}
            </code>
          </pre>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Verifying Webhooks</h3>
          <p className="mb-4">
            To verify that a webhook came from Axiom, check the signature in the headers:
          </p>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto mb-4">
            <code>
{`// Headers included with webhook requests
X-Axiom-Signature: sha256=5257a869e7bfeb5dd189fd5d6b8f5f4e0ea804cb...
X-Axiom-Timestamp: 1692979500`}
            </code>
          </pre>
          <p className="mb-4">
            The signature is a HMAC SHA-256 hash of the payload using your webhook secret as the key.
          </p>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto mb-4">
            <code>
{`// JavaScript example to verify signature
const crypto = require('crypto');

function verifySignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}`}
            </code>
          </pre>
        </div>
      )
    }
  ];

  const renderSidebar = () => {
    return (
      <div className="w-64 border-r border-gray-200 dark:border-dark-border">
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-dark-text mb-4">API Reference</h3>
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">Axiom API Reference</h1>
        <p className="text-gray-600 dark:text-dark-muted">
          Complete API documentation for developers integrating with Axiom
        </p>
      </div>
      <div className="flex h-[800px]">
        {renderSidebar()}
        {renderContent()}
      </div>
    </div>
  );
};

export default ApiReferencePage; 