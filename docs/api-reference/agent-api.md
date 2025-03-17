# Agent API

The Agents API allows you to create, manage, and interact with AI agents.

## List Agents

```bash
GET /agents

# Query parameters
# owner (optional): Filter by owner address
# status (optional): Filter by status (active, inactive)
# category (optional): Filter by category
```

### Response

```json
{
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
}
```

## Get Agent

```bash
GET /agents/{agent_id}
```

### Response

```json
{
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
}
```

## Create Agent

```bash
POST /agents

# Request body
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
}
```

### Response

```json
{
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
}
```

## Update Agent

```bash
PUT /agents/{agent_id}

# Request body
{
  "name": "Updated Agent Name",
  "description": "Updated description",
  "category": "trading",
  "configuration": {
    "capabilities": {
      "market_data": true,
      "technical_analysis": true,
      "alerts": true
    },
    "parameters": {
      "update_frequency": "10m",
      "assets": ["INJ", "BTC", "ETH", "SOL"]
    }
  }
}
```

### Response

```json
{
  "id": "agent-789",
  "name": "Updated Agent Name",
  "description": "Updated description",
  "owner": "inj1ady3s7whj340xc7l3xj8zl4gzyveupn4z7yy8f",
  "category": "trading",
  "status": "active",
  "updated_at": "2025-08-26T10:20:00Z",
  "configuration": {
    "capabilities": {
      "market_data": true,
      "technical_analysis": true,
      "alerts": true
    },
    "parameters": {
      "update_frequency": "10m",
      "assets": ["INJ", "BTC", "ETH", "SOL"]
    }
  }
}
```

## Delete Agent

```bash
DELETE /agents/{agent_id}
```

### Response

```json
{
  "success": true,
  "message": "Agent deleted successfully"
}
``` 