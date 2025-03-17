# Authentication

This document describes the authentication methods used by the Axiom API.

## API Key Authentication

Include your API key in the request headers:

```bash
curl -X GET "https://api.axiom.network/v1/agents" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Wallet Authentication

For blockchain interactions, you can authenticate using your wallet:

1. **Request a nonce:**
```bash
POST /auth/nonce
{
  "address": "inj1ady3s7whj340xc7l3xj8zl4gzyveupn4z7yy8f"
}
```

2. **Sign the nonce with your wallet**

3. **Exchange the signature for a JWT:**
```bash
POST /auth/login
{
  "address": "inj1ady3s7whj340xc7l3xj8zl4gzyveupn4z7yy8f",
  "signature": "0x1234...",
  "nonce": "abcd1234..."
}
```

## Response

```json
{
  "token": "eyJhbGci...",
  "expires_at": "2025-12-31T23:59:59Z"
}
```

## Rate Limits

The API has the following rate limits:

- Free tier: 100 requests per minute
- Pro tier: 1,000 requests per minute
- Enterprise tier: Custom limits

The API returns HTTP 429 (Too Many Requests) when rate limits are exceeded. 