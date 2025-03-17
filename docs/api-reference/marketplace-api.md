# Marketplace API

The Marketplace API allows you to browse, purchase, and list agents on the Axiom marketplace.

## List Marketplace Listings

```bash
GET /marketplace

# Query parameters
# category (optional): Filter by category
# price_min (optional): Minimum price in INJ
# price_max (optional): Maximum price in INJ
# sort_by (optional): Sort by price, rating, created_at
# sort_dir (optional): asc or desc
```

### Response

```json
{
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
}
```

## Get Listing Details

```bash
GET /marketplace/{listing_id}
```

### Response

```json
{
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
}
```

## Create Listing

```bash
POST /marketplace

# Request body
{
  "agent_id": "agent-456",
  "price": "5.0",
  "currency": "INJ",
  "description": "Advanced market monitoring with customizable alerts"
}
```

### Response

```json
{
  "id": "listing-123",
  "agent_id": "agent-456",
  "name": "Market Sentinel",
  "description": "Advanced market monitoring with customizable alerts",
  "category": "finance",
  "price": "5.0",
  "currency": "INJ",
  "seller": "inj1ady3s7whj340xc7l3xj8zl4gzyveupn4z7yy8f",
  "created_at": "2025-06-20T11:30:00Z",
  "transaction_hash": "0xabcdef1234567890"
}
```

## Purchase Agent

```bash
POST /marketplace/{listing_id}/purchase

# Request body is empty, authorization header is used to identify the buyer
```

### Response

```json
{
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
}
```

## Submit Review

```bash
POST /marketplace/{listing_id}/reviews

# Request body
{
  "rating": 5,
  "comment": "Excellent agent, very accurate alerts!"
}
```

### Response

```json
{
  "id": "review-123",
  "listing_id": "listing-123",
  "user": "inj1abc123",
  "rating": 5,
  "comment": "Excellent agent, very accurate alerts!",
  "date": "2025-07-10T15:20:00Z"
}
``` 