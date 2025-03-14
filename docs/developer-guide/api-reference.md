# Axiom API Reference

This document provides a comprehensive reference for the Axiom API, which allows developers to programmatically interact with the Axiom platform.

## API Overview

The Axiom API is a RESTful API that uses JSON for request and response bodies. The API is secured using JWT authentication and supports rate limiting to ensure fair usage.

### Base URL

```
https://api.axiom.example.com/v1
```

### Authentication

All API requests require authentication using a JWT token. To obtain a token:

1. Create an API key in the Axiom platform under Account Settings > API Keys
2. Use the API key to request a JWT token from the authentication endpoint
3. Include the JWT token in the Authorization header of all API requests

Example:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Endpoints

### Authentication

#### Get JWT Token

```
POST /auth/token
```

Request body:

```json
{
  "api_key": "your_api_key",
  "api_secret": "your_api_secret"
}
```

Response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_at": "2023-12-31T23:59:59Z"
}
```

### Agents

#### List Agents

Retrieve a list of all agents owned by the authenticated user.

```
GET /agents
```

Query parameters:

| Parameter | Type   | Description                                      |
|-----------|--------|--------------------------------------------------|
| status    | string | Filter by agent status (active, paused, draft)   |
| page      | int    | Page number for pagination (default: 1)          |
| limit     | int    | Number of results per page (default: 20, max: 100) |

Response:

```json
{
  "agents": [
    {
      "id": "agent_123456",
      "name": "Market Monitor",
      "description": "Monitors BTC/USD price movements",
      "status": "active",
      "created_at": "2023-01-15T10:30:00Z",
      "updated_at": "2023-01-20T14:45:00Z"
    },
    {
      "id": "agent_789012",
      "name": "Trading Bot",
      "description": "Executes trades based on RSI",
      "status": "paused",
      "created_at": "2023-02-10T08:15:00Z",
      "updated_at": "2023-02-15T11:20:00Z"
    }
  ],
  "pagination": {
    "total": 15,
    "page": 1,
    "limit": 20,
    "pages": 1
  }
}
```

#### Get Agent Details

Retrieve detailed information about a specific agent.

```
GET /agents/{agent_id}
```

Response:

```json
{
  "id": "agent_123456",
  "name": "Market Monitor",
  "description": "Monitors BTC/USD price movements",
  "status": "active",
  "capabilities": [
    {
      "type": "market_monitoring",
      "config": {
        "market": "BTC/USD",
        "timeframe": "1h",
        "indicators": ["RSI", "MACD"]
      }
    },
    {
      "type": "notification",
      "config": {
        "channels": ["email", "telegram"],
        "triggers": [
          {
            "condition": "price_change",
            "threshold": 5.0,
            "direction": "any"
          }
        ]
      }
    }
  ],
  "created_at": "2023-01-15T10:30:00Z",
  "updated_at": "2023-01-20T14:45:00Z",
  "last_active": "2023-03-01T09:12:34Z",
  "metrics": {
    "actions_taken": 156,
    "success_rate": 98.7,
    "error_rate": 1.3,
    "uptime": 99.9
  }
}
```

#### Create Agent

Create a new agent.

```
POST /agents
```

Request body:

```json
{
  "name": "New Trading Bot",
  "description": "Executes trades based on moving averages",
  "capabilities": [
    {
      "type": "market_monitoring",
      "config": {
        "market": "ETH/USD",
        "timeframe": "15m",
        "indicators": ["SMA", "EMA"]
      }
    },
    {
      "type": "trading",
      "config": {
        "strategy": "moving_average_crossover",
        "parameters": {
          "fast_period": 9,
          "slow_period": 21
        },
        "position_sizing": {
          "type": "percentage",
          "value": 5.0
        },
        "risk_management": {
          "stop_loss": 2.0,
          "take_profit": 4.0
        }
      }
    }
  ]
}
```

Response:

```json
{
  "id": "agent_345678",
  "name": "New Trading Bot",
  "description": "Executes trades based on moving averages",
  "status": "draft",
  "capabilities": [...],
  "created_at": "2023-03-10T15:30:00Z",
  "updated_at": "2023-03-10T15:30:00Z"
}
```

#### Update Agent

Update an existing agent.

```
PUT /agents/{agent_id}
```

Request body:

```json
{
  "name": "Updated Trading Bot",
  "description": "Executes trades based on improved moving averages",
  "capabilities": [...]
}
```

Response:

```json
{
  "id": "agent_345678",
  "name": "Updated Trading Bot",
  "description": "Executes trades based on improved moving averages",
  "status": "draft",
  "capabilities": [...],
  "created_at": "2023-03-10T15:30:00Z",
  "updated_at": "2023-03-15T09:45:00Z"
}
```

#### Delete Agent

Delete an agent.

```
DELETE /agents/{agent_id}
```

Response:

```json
{
  "success": true,
  "message": "Agent deleted successfully"
}
```

#### Deploy Agent

Deploy an agent to the blockchain.

```
POST /agents/{agent_id}/deploy
```

Request body:

```json
{
  "network": "testnet",
  "resources": {
    "compute": "standard",
    "storage": "10GB",
    "execution_frequency": "continuous"
  }
}
```

Response:

```json
{
  "deployment_id": "deploy_123456",
  "agent_id": "agent_345678",
  "status": "pending",
  "network": "testnet",
  "resources": {
    "compute": "standard",
    "storage": "10GB",
    "execution_frequency": "continuous"
  },
  "estimated_cost": {
    "deployment": "0.5 INJ",
    "monthly_operation": "2.0 INJ"
  },
  "created_at": "2023-03-20T11:30:00Z"
}
```

#### Start/Stop Agent

Start or stop a deployed agent.

```
POST /agents/{agent_id}/status
```

Request body:

```json
{
  "status": "active" // or "paused"
}
```

Response:

```json
{
  "id": "agent_345678",
  "status": "active",
  "updated_at": "2023-03-25T14:20:00Z"
}
```

### Agent Activities

#### Get Agent Activities

Retrieve the activity log for a specific agent.

```
GET /agents/{agent_id}/activities
```

Query parameters:

| Parameter | Type   | Description                                      |
|-----------|--------|--------------------------------------------------|
| type      | string | Filter by activity type (action, error, system)  |
| start_date| string | Start date for filtering (ISO 8601 format)       |
| end_date  | string | End date for filtering (ISO 8601 format)         |
| page      | int    | Page number for pagination (default: 1)          |
| limit     | int    | Number of results per page (default: 20, max: 100) |

Response:

```json
{
  "activities": [
    {
      "id": "activity_123456",
      "agent_id": "agent_345678",
      "type": "action",
      "description": "Executed buy order for 0.1 ETH at $1,800",
      "details": {
        "market": "ETH/USD",
        "action": "buy",
        "amount": 0.1,
        "price": 1800.0,
        "transaction_id": "0x1234..."
      },
      "timestamp": "2023-03-26T10:15:30Z"
    },
    {
      "id": "activity_123457",
      "agent_id": "agent_345678",
      "type": "system",
      "description": "Agent started",
      "details": {
        "previous_status": "paused",
        "new_status": "active"
      },
      "timestamp": "2023-03-25T14:20:00Z"
    }
  ],
  "pagination": {
    "total": 156,
    "page": 1,
    "limit": 20,
    "pages": 8
  }
}
```

### Marketplace

#### List Marketplace Agents

Retrieve a list of agents available on the marketplace.

```
GET /marketplace/agents
```

Query parameters:

| Parameter | Type   | Description                                      |
|-----------|--------|--------------------------------------------------|
| category  | string | Filter by category                               |
| price_min | float  | Minimum price                                    |
| price_max | float  | Maximum price                                    |
| sort_by   | string | Sort field (price, rating, created_at)           |
| sort_dir  | string | Sort direction (asc, desc)                       |
| page      | int    | Page number for pagination (default: 1)          |
| limit     | int    | Number of results per page (default: 20, max: 100) |

Response:

```json
{
  "agents": [
    {
      "id": "market_agent_123456",
      "name": "Advanced RSI Trader",
      "description": "Trading bot using advanced RSI strategies",
      "creator": "0x9876...",
      "price": 5.0,
      "currency": "INJ",
      "rating": 4.8,
      "reviews_count": 24,
      "created_at": "2023-02-10T08:15:00Z"
    },
    {
      "id": "market_agent_789012",
      "name": "Volatility Monitor",
      "description": "Monitors market volatility and sends alerts",
      "creator": "0x5432...",
      "price": 2.5,
      "currency": "INJ",
      "rating": 4.2,
      "reviews_count": 15,
      "created_at": "2023-01-20T14:45:00Z"
    }
  ],
  "pagination": {
    "total": 120,
    "page": 1,
    "limit": 20,
    "pages": 6
  }
}
```

#### Get Marketplace Agent Details

Retrieve detailed information about a specific marketplace agent.

```
GET /marketplace/agents/{agent_id}
```

Response:

```json
{
  "id": "market_agent_123456",
  "name": "Advanced RSI Trader",
  "description": "Trading bot using advanced RSI strategies",
  "long_description": "This agent implements a sophisticated RSI trading strategy...",
  "creator": {
    "address": "0x9876...",
    "name": "TradingExpert",
    "rating": 4.9,
    "agents_count": 12
  },
  "price": 5.0,
  "currency": "INJ",
  "rating": 4.8,
  "reviews_count": 24,
  "capabilities": [...],
  "performance": {
    "backtest_results": {
      "period": "Jan 2022 - Dec 2022",
      "profit_loss": "+45.2%",
      "max_drawdown": "-12.3%",
      "win_rate": "68.5%"
    }
  },
  "created_at": "2023-02-10T08:15:00Z",
  "updated_at": "2023-02-15T11:20:00Z"
}
```

#### Purchase Marketplace Agent

Purchase an agent from the marketplace.

```
POST /marketplace/agents/{agent_id}/purchase
```

Response:

```json
{
  "purchase_id": "purchase_123456",
  "agent_id": "market_agent_123456",
  "price": 5.0,
  "currency": "INJ",
  "transaction_id": "0x5678...",
  "status": "completed",
  "purchased_at": "2023-03-30T09:45:00Z"
}
```

### Wallet Integration

#### Get Wallet Balance

Retrieve the balance of the connected wallet.

```
GET /wallet/balance
```

Response:

```json
{
  "address": "0x1234...",
  "balances": [
    {
      "token": "INJ",
      "amount": 125.75,
      "usd_value": 500.25
    },
    {
      "token": "USDT",
      "amount": 1000.0,
      "usd_value": 1000.0
    }
  ],
  "total_usd_value": 1500.25
}
```

#### Get Transaction History

Retrieve the transaction history for the connected wallet.

```
GET /wallet/transactions
```

Query parameters:

| Parameter | Type   | Description                                      |
|-----------|--------|--------------------------------------------------|
| type      | string | Filter by transaction type                       |
| start_date| string | Start date for filtering (ISO 8601 format)       |
| end_date  | string | End date for filtering (ISO 8601 format)         |
| page      | int    | Page number for pagination (default: 1)          |
| limit     | int    | Number of results per page (default: 20, max: 100) |

Response:

```json
{
  "transactions": [
    {
      "id": "tx_123456",
      "type": "agent_deployment",
      "amount": 0.5,
      "token": "INJ",
      "status": "confirmed",
      "hash": "0x1234...",
      "timestamp": "2023-03-20T11:30:00Z"
    },
    {
      "id": "tx_789012",
      "type": "marketplace_purchase",
      "amount": 5.0,
      "token": "INJ",
      "status": "confirmed",
      "hash": "0x5678...",
      "timestamp": "2023-03-30T09:45:00Z"
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 20,
    "pages": 3
  }
}
```

## Error Handling

The API uses standard HTTP status codes to indicate the success or failure of requests. In case of an error, the response body will contain additional information about the error.

Example error response:

```json
{
  "error": {
    "code": "invalid_request",
    "message": "The request was invalid",
    "details": "The 'name' field is required"
  }
}
```

Common error codes:

| Status Code | Error Code         | Description                                      |
|-------------|-------------------|--------------------------------------------------|
| 400         | invalid_request   | The request was invalid                          |
| 401         | unauthorized      | Authentication is required                       |
| 403         | forbidden         | The authenticated user doesn't have permission   |
| 404         | not_found         | The requested resource was not found             |
| 429         | rate_limited      | Too many requests                                |
| 500         | server_error      | An unexpected server error occurred              |

## Rate Limiting

The API implements rate limiting to ensure fair usage. Rate limits are applied on a per-API key basis.

Rate limit headers are included in all API responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1617181200
```

If you exceed the rate limit, you'll receive a 429 Too Many Requests response.

## Webhooks

The Axiom API supports webhooks for real-time notifications about events. To set up a webhook:

1. Navigate to Account Settings > Webhooks in the Axiom platform
2. Add a new webhook with your endpoint URL
3. Select the events you want to receive notifications for

### Webhook Events

| Event Type                | Description                                      |
|--------------------------|--------------------------------------------------|
| agent.deployed           | An agent has been deployed                       |
| agent.started            | An agent has been started                        |
| agent.stopped            | An agent has been stopped                        |
| agent.error              | An agent has encountered an error                |
| agent.action             | An agent has taken an action                     |
| marketplace.purchase     | A marketplace purchase has been completed        |
| wallet.transaction       | A wallet transaction has been completed          |

### Webhook Payload

Example webhook payload:

```json
{
  "event": "agent.action",
  "timestamp": "2023-04-01T10:15:30Z",
  "data": {
    "agent_id": "agent_345678",
    "action": {
      "type": "trade",
      "details": {
        "market": "ETH/USD",
        "side": "buy",
        "amount": 0.1,
        "price": 1800.0,
        "transaction_id": "0x1234..."
      }
    }
  }
}
```

## SDKs and Client Libraries

The Axiom API is accessible via several client libraries:

- [JavaScript/TypeScript SDK](https://github.com/axiom/js-sdk)
- [Python SDK](https://github.com/axiom/python-sdk)
- [Go SDK](https://github.com/axiom/go-sdk)
- [Rust SDK](https://github.com/axiom/rust-sdk)

## API Versioning

The Axiom API is versioned to ensure backward compatibility. The current version is v1.

When a new version is released, the previous version will be supported for at least 6 months to allow time for migration.

## Support

If you encounter any issues or have questions about the API, please contact our support team at api-support@axiom.example.com or visit our [Developer Forum](https://forum.axiom.example.com). 