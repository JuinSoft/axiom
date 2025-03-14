# Smart Contract Integration Guide

This guide provides detailed information on how to integrate with the Axiom smart contracts on the Injective blockchain.

## Overview

Axiom consists of two primary smart contracts:

1. **Agent Registry Contract**: Manages the registration and metadata of AI agents
2. **Marketplace Contract**: Handles the buying, selling, and licensing of agents

These contracts are deployed on the Injective blockchain and can be interacted with using standard CosmWasm methods.

## Prerequisites

Before integrating with Axiom smart contracts, you'll need:

1. **Injective CLI**: For interacting with the Injective blockchain
2. **Injective Wallet**: A wallet with INJ tokens for transaction fees
3. **CosmWasm Knowledge**: Basic understanding of CosmWasm smart contracts
4. **Rust (optional)**: If you plan to develop custom contracts that interact with Axiom

## Contract Addresses

### Testnet

- Agent Registry: `inj1abc123def456ghi789jkl0mnopqrstuvwxyz`
- Marketplace: `inj1xyz987wvu654tsr321qpo0nmlkjihgfedcba`

### Mainnet

- Agent Registry: `inj1def456ghi789jkl0mnopqrstuvwxyzabc123`
- Marketplace: `inj1wvu654tsr321qpo0nmlkjihgfedcbaxyz987`

## Agent Registry Contract

The Agent Registry contract manages the registration and metadata of AI agents on the Axiom platform.

### Data Structures

#### Agent

```rust
pub struct Agent {
    pub id: String,
    pub owner: Addr,
    pub name: String,
    pub description: String,
    pub capabilities: Vec<Capability>,
    pub version: String,
    pub created_at: u64,
    pub updated_at: u64,
    pub status: AgentStatus,
}

pub enum AgentStatus {
    Draft,
    Active,
    Paused,
    Decommissioned,
}

pub struct Capability {
    pub capability_type: String,
    pub config: Binary, // JSON-encoded configuration
}
```

### Messages

#### RegisterAgent

Register a new agent in the registry.

```rust
pub struct RegisterAgentMsg {
    pub name: String,
    pub description: String,
    pub capabilities: Vec<Capability>,
    pub version: String,
}
```

Example (using Injective CLI):

```bash
injective-cli tx wasm execute <agent_registry_contract_address> '{
  "register_agent": {
    "name": "Market Monitor",
    "description": "Monitors BTC/USD price movements",
    "capabilities": [
      {
        "capability_type": "market_monitoring",
        "config": "{\"market\":\"BTC/USD\",\"timeframe\":\"1h\",\"indicators\":[\"RSI\",\"MACD\"]}"
      }
    ],
    "version": "1.0.0"
  }
}' --from <your_wallet> --gas-prices 500000000inj --gas-adjustment 1.3 --gas auto
```

#### UpdateAgent

Update an existing agent's metadata.

```rust
pub struct UpdateAgentMsg {
    pub agent_id: String,
    pub name: Option<String>,
    pub description: Option<String>,
    pub capabilities: Option<Vec<Capability>>,
    pub version: Option<String>,
}
```

Example:

```bash
injective-cli tx wasm execute <agent_registry_contract_address> '{
  "update_agent": {
    "agent_id": "agent_123456",
    "name": "Enhanced Market Monitor",
    "description": "Monitors BTC/USD price movements with enhanced alerts",
    "version": "1.1.0"
  }
}' --from <your_wallet> --gas-prices 500000000inj --gas-adjustment 1.3 --gas auto
```

#### UpdateAgentStatus

Update an agent's status.

```rust
pub struct UpdateAgentStatusMsg {
    pub agent_id: String,
    pub status: AgentStatus,
}
```

Example:

```bash
injective-cli tx wasm execute <agent_registry_contract_address> '{
  "update_agent_status": {
    "agent_id": "agent_123456",
    "status": "Active"
  }
}' --from <your_wallet> --gas-prices 500000000inj --gas-adjustment 1.3 --gas auto
```

#### DecommissionAgent

Decommission an agent, removing it from active use.

```rust
pub struct DecommissionAgentMsg {
    pub agent_id: String,
}
```

Example:

```bash
injective-cli tx wasm execute <agent_registry_contract_address> '{
  "decommission_agent": {
    "agent_id": "agent_123456"
  }
}' --from <your_wallet> --gas-prices 500000000inj --gas-adjustment 1.3 --gas auto
```

### Queries

#### GetAgent

Retrieve information about a specific agent.

```rust
pub struct GetAgentQuery {
    pub agent_id: String,
}
```

Example:

```bash
injective-cli query wasm contract-state smart <agent_registry_contract_address> '{
  "get_agent": {
    "agent_id": "agent_123456"
  }
}'
```

#### ListAgents

List agents with optional filtering.

```rust
pub struct ListAgentsQuery {
    pub owner: Option<String>,
    pub status: Option<AgentStatus>,
    pub limit: Option<u32>,
    pub start_after: Option<String>,
}
```

Example:

```bash
injective-cli query wasm contract-state smart <agent_registry_contract_address> '{
  "list_agents": {
    "owner": "inj1...",
    "status": "Active",
    "limit": 10
  }
}'
```

## Marketplace Contract

The Marketplace contract handles the buying, selling, and licensing of agents on the Axiom platform.

### Data Structures

#### Listing

```rust
pub struct Listing {
    pub id: String,
    pub agent_id: String,
    pub seller: Addr,
    pub price: Coin,
    pub license_type: LicenseType,
    pub royalty_percentage: Option<u8>,
    pub created_at: u64,
    pub status: ListingStatus,
}

pub enum LicenseType {
    OneTime,
    Subscription,
    UsageBased,
    OpenSource,
}

pub enum ListingStatus {
    Active,
    Paused,
    Sold,
    Cancelled,
}
```

#### Purchase

```rust
pub struct Purchase {
    pub id: String,
    pub listing_id: String,
    pub buyer: Addr,
    pub price: Coin,
    pub purchased_at: u64,
}
```

### Messages

#### CreateListing

Create a new listing for an agent on the marketplace.

```rust
pub struct CreateListingMsg {
    pub agent_id: String,
    pub price: Coin,
    pub license_type: LicenseType,
    pub royalty_percentage: Option<u8>,
}
```

Example:

```bash
injective-cli tx wasm execute <marketplace_contract_address> '{
  "create_listing": {
    "agent_id": "agent_123456",
    "price": {
      "denom": "inj",
      "amount": "5000000000000000000"
    },
    "license_type": "OneTime",
    "royalty_percentage": 10
  }
}' --from <your_wallet> --gas-prices 500000000inj --gas-adjustment 1.3 --gas auto
```

#### UpdateListing

Update an existing listing.

```rust
pub struct UpdateListingMsg {
    pub listing_id: String,
    pub price: Option<Coin>,
    pub license_type: Option<LicenseType>,
    pub royalty_percentage: Option<u8>,
    pub status: Option<ListingStatus>,
}
```

Example:

```bash
injective-cli tx wasm execute <marketplace_contract_address> '{
  "update_listing": {
    "listing_id": "listing_123456",
    "price": {
      "denom": "inj",
      "amount": "4000000000000000000"
    },
    "status": "Paused"
  }
}' --from <your_wallet> --gas-prices 500000000inj --gas-adjustment 1.3 --gas auto
```

#### PurchaseAgent

Purchase an agent from the marketplace.

```rust
pub struct PurchaseAgentMsg {
    pub listing_id: String,
}
```

Example:

```bash
injective-cli tx wasm execute <marketplace_contract_address> '{
  "purchase_agent": {
    "listing_id": "listing_123456"
  }
}' --amount 5000000000000000000inj --from <your_wallet> --gas-prices 500000000inj --gas-adjustment 1.3 --gas auto
```

#### CancelListing

Cancel a listing on the marketplace.

```rust
pub struct CancelListingMsg {
    pub listing_id: String,
}
```

Example:

```bash
injective-cli tx wasm execute <marketplace_contract_address> '{
  "cancel_listing": {
    "listing_id": "listing_123456"
  }
}' --from <your_wallet> --gas-prices 500000000inj --gas-adjustment 1.3 --gas auto
```

### Queries

#### GetListing

Retrieve information about a specific listing.

```rust
pub struct GetListingQuery {
    pub listing_id: String,
}
```

Example:

```bash
injective-cli query wasm contract-state smart <marketplace_contract_address> '{
  "get_listing": {
    "listing_id": "listing_123456"
  }
}'
```

#### ListListings

List marketplace listings with optional filtering.

```rust
pub struct ListListingsQuery {
    pub seller: Option<String>,
    pub status: Option<ListingStatus>,
    pub license_type: Option<LicenseType>,
    pub price_min: Option<Coin>,
    pub price_max: Option<Coin>,
    pub limit: Option<u32>,
    pub start_after: Option<String>,
}
```

Example:

```bash
injective-cli query wasm contract-state smart <marketplace_contract_address> '{
  "list_listings": {
    "status": "Active",
    "license_type": "OneTime",
    "limit": 10
  }
}'
```

#### GetPurchase

Retrieve information about a specific purchase.

```rust
pub struct GetPurchaseQuery {
    pub purchase_id: String,
}
```

Example:

```bash
injective-cli query wasm contract-state smart <marketplace_contract_address> '{
  "get_purchase": {
    "purchase_id": "purchase_123456"
  }
}'
```

#### ListPurchases

List purchases with optional filtering.

```rust
pub struct ListPurchasesQuery {
    pub buyer: Option<String>,
    pub listing_id: Option<String>,
    pub limit: Option<u32>,
    pub start_after: Option<String>,
}
```

Example:

```bash
injective-cli query wasm contract-state smart <marketplace_contract_address> '{
  "list_purchases": {
    "buyer": "inj1...",
    "limit": 10
  }
}'
```

## Integration Examples

### JavaScript/TypeScript Integration

Using the `@injectivelabs/sdk-ts` package:

```typescript
import { 
  ChainGrpcWasmApi, 
  MsgExecuteContract 
} from '@injectivelabs/sdk-ts';
import { PrivateKey } from '@injectivelabs/sdk-ts/dist/core/accounts';
import { Network, getNetworkEndpoints } from '@injectivelabs/networks';

// Setup
const network = Network.TestnetK8s;
const endpoints = getNetworkEndpoints(network);
const chainGrpcWasmApi = new ChainGrpcWasmApi(endpoints.grpc);

// Initialize private key and wallet
const privateKey = PrivateKey.fromMnemonic('your mnemonic here');
const injectiveAddress = privateKey.toBech32();

// Contract addresses
const agentRegistryAddress = 'inj1abc123def456ghi789jkl0mnopqrstuvwxyz';
const marketplaceAddress = 'inj1xyz987wvu654tsr321qpo0nmlkjihgfedcba';

// Example: Register an agent
async function registerAgent() {
  const msg = {
    register_agent: {
      name: "Market Monitor",
      description: "Monitors BTC/USD price movements",
      capabilities: [
        {
          capability_type: "market_monitoring",
          config: JSON.stringify({
            market: "BTC/USD",
            timeframe: "1h",
            indicators: ["RSI", "MACD"]
          })
        }
      ],
      version: "1.0.0"
    }
  };

  const executeMsg = MsgExecuteContract.fromJSON({
    sender: injectiveAddress,
    contractAddress: agentRegistryAddress,
    msg: msg
  });

  // Sign and broadcast the transaction
  // ... (implementation depends on your application's transaction handling)
}

// Example: Query an agent
async function getAgent(agentId: string) {
  const response = await chainGrpcWasmApi.fetchSmartContractState(
    agentRegistryAddress,
    Buffer.from(JSON.stringify({ get_agent: { agent_id: agentId } })).toString('base64')
  );
  
  return JSON.parse(Buffer.from(response.data).toString());
}
```

### Python Integration

Using the `pyinjective` package:

```python
from pyinjective.async_client import AsyncClient
from pyinjective.transaction import Transaction
from pyinjective.wallet import PrivateKey
import json
import base64

# Setup
network = "testnet"
client = AsyncClient(network)
private_key = PrivateKey.from_mnemonic("your mnemonic here")
public_key = private_key.to_public_key()
address = public_key.to_address()
address_str = address.to_acc_bech32()

# Contract addresses
agent_registry_address = "inj1abc123def456ghi789jkl0mnopqrstuvwxyz"
marketplace_address = "inj1xyz987wvu654tsr321qpo0nmlkjihgfedcba"

# Example: Register an agent
async def register_agent():
    msg = {
        "register_agent": {
            "name": "Market Monitor",
            "description": "Monitors BTC/USD price movements",
            "capabilities": [
                {
                    "capability_type": "market_monitoring",
                    "config": json.dumps({
                        "market": "BTC/USD",
                        "timeframe": "1h",
                        "indicators": ["RSI", "MACD"]
                    })
                }
            ],
            "version": "1.0.0"
        }
    }
    
    # Create transaction
    tx = Transaction()
    tx.add_message(
        "wasm/MsgExecuteContract",
        {
            "sender": address_str,
            "contract": agent_registry_address,
            "msg": json.dumps(msg),
            "funds": []
        }
    )
    
    # Sign and broadcast transaction
    # ... (implementation depends on your application's transaction handling)

# Example: Query an agent
async def get_agent(agent_id):
    query = {
        "get_agent": {
            "agent_id": agent_id
        }
    }
    
    response = await client.query_contract_smart(
        agent_registry_address,
        query
    )
    
    return response
```

## Best Practices

### Security Considerations

1. **Input Validation**: Always validate user inputs before sending them to the contracts
2. **Error Handling**: Implement proper error handling for contract interactions
3. **Gas Management**: Set appropriate gas limits and prices for transactions
4. **Wallet Security**: Secure private keys and implement proper key management
5. **Testing**: Test all contract interactions thoroughly on testnet before moving to mainnet

### Performance Optimization

1. **Batch Transactions**: Combine multiple operations into a single transaction when possible
2. **Caching**: Cache contract query results to reduce network calls
3. **Gas Estimation**: Use gas estimation to avoid transaction failures
4. **Pagination**: Use pagination for large result sets in queries

### Integration Patterns

1. **Event Monitoring**: Listen for contract events to trigger actions in your application
2. **Retry Logic**: Implement retry logic for failed transactions
3. **Idempotent Operations**: Design operations to be idempotent to handle retries safely
4. **Versioning**: Handle contract versioning in your integration

## Troubleshooting

### Common Issues

1. **Insufficient Gas**: Increase gas limit or gas price
2. **Permission Denied**: Ensure the wallet has the necessary permissions
3. **Contract Execution Failed**: Check the error message for specific issues
4. **Invalid Input**: Validate all inputs according to contract requirements

### Debugging Tools

1. **Block Explorer**: Use the Injective Explorer to view transaction details
2. **Contract Logs**: Check contract logs for error messages
3. **Testnet**: Test problematic transactions on testnet first
4. **Simulation**: Use transaction simulation to identify issues before broadcasting

## Support and Resources

- [Injective Documentation](https://docs.injective.network/)
- [CosmWasm Documentation](https://docs.cosmwasm.com/)
- [Axiom Developer Forum](https://forum.axiom.example.com)
- [Axiom Discord](https://discord.gg/axiom)

For direct support, contact the Axiom team at developers@axiom.example.com. 