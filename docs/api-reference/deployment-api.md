# Deployment API

The Deployment API allows you to deploy agents to the Injective blockchain.

## Deploy Agent

```bash
POST /agents/{agent_id}/deploy

# Request body
{
  "network": "mainnet", # or "testnet"
  "gas_limit": 300000, # optional
  "gas_price": "0.000001", # optional
  "memo": "Deploy market data agent" # optional
}
```

### Response

```json
{
  "deployment_id": "deployment-123",
  "agent_id": "agent-123",
  "status": "pending",
  "transaction_hash": "0x1234567890abcdef",
  "owner": "inj1ady3s7whj340xc7l3xj8zl4gzyveupn4z7yy8f",
  "timestamp": "2023-08-25T16:30:00Z",
  "network": "mainnet"
}
```

## Get Deployment Status

```bash
GET /agents/{agent_id}/deployments/{deployment_id}
```

### Response

```json
{
  "deployment_id": "deployment-123",
  "agent_id": "agent-123",
  "status": "completed", # pending, completed, failed
  "transaction_hash": "0x1234567890abcdef",
  "contract_address": "inj1qwexyz098765",
  "owner": "inj1ady3s7whj340xc7l3xj8zl4gzyveupn4z7yy8f",
  "timestamp": "2023-08-25T16:30:00Z",
  "completed_at": "2023-08-25T16:32:30Z",
  "network": "mainnet",
  "gas_used": 250000,
  "error": null # present only if status is "failed"
}
```

## List Deployments

```bash
GET /agents/{agent_id}/deployments

# Query parameters
# status (optional): Filter by status (pending, completed, failed)
# network (optional): Filter by network (mainnet, testnet)
```

### Response

```json
{
  "deployments": [
    {
      "deployment_id": "deployment-123",
      "agent_id": "agent-123",
      "status": "completed",
      "transaction_hash": "0x1234567890abcdef",
      "contract_address": "inj1qwexyz098765",
      "owner": "inj1ady3s7whj340xc7l3xj8zl4gzyveupn4z7yy8f",
      "timestamp": "2023-08-25T16:30:00Z",
      "completed_at": "2023-08-25T16:32:30Z",
      "network": "mainnet"
    },
    {
      "deployment_id": "deployment-456",
      "agent_id": "agent-123",
      "status": "failed",
      "transaction_hash": "0x0987654321fedcba",
      "owner": "inj1ady3s7whj340xc7l3xj8zl4gzyveupn4z7yy8f",
      "timestamp": "2023-08-24T14:20:00Z",
      "completed_at": "2023-08-24T14:21:15Z",
      "network": "testnet",
      "error": "Insufficient gas"
    }
  ],
  "pagination": {
    "total": 2,
    "page": 1,
    "limit": 10
  }
}
```

## Generate Deployment Configuration

```bash
POST /agents/{agent_id}/generate-config

# Request body
{
  "network": "mainnet", # or "testnet"
  "template_id": "template-123" # optional, to use a pre-defined template
}
```

### Response

```json
{
  "config_id": "config-123",
  "agent_id": "agent-123",
  "network": "mainnet",
  "configuration": {
    "owner": "inj1ady3s7whj340xc7l3xj8zl4gzyveupn4z7yy8f",
    "admin": "inj1ady3s7whj340xc7l3xj8zl4gzyveupn4z7yy8f",
    "initial_funds": [],
    "code_id": 123,
    "label": "Market Oracle Agent",
    "msg": {
      "name": "Market Oracle",
      "description": "Provides reliable market data",
      "capabilities": {
        "market_data": true,
        "price_alerts": true
      },
      "parameters": {
        "update_frequency": "1m",
        "sources": ["binance", "injective"]
      }
    }
  },
  "estimated_gas": 250000,
  "estimated_cost": "0.25",
  "currency": "INJ",
  "timestamp": "2023-08-25T16:35:00Z"
}
```

## Update Deployment

```bash
PUT /agents/{agent_id}/deployments/{deployment_id}

# Request body
{
  "status": "stopped" # or "started"
}
```

### Response

```json
{
  "deployment_id": "deployment-123",
  "agent_id": "agent-123",
  "status": "stopped",
  "transaction_hash": "0x567890abcdef1234",
  "contract_address": "inj1qwexyz098765",
  "owner": "inj1ady3s7whj340xc7l3xj8zl4gzyveupn4z7yy8f",
  "timestamp": "2023-08-25T16:40:00Z",
  "network": "mainnet"
}
``` 