# Axiom Smart Contracts

This directory contains the CosmWasm smart contracts for the Axiom platform.

## Contracts

### Agent Registry

The Agent Registry contract manages the registration and lifecycle of AI agents on the Injective blockchain. It allows users to:

- Register new AI agents
- Update agent configurations
- Activate/deactivate agents
- Query agent information

### Marketplace

The Marketplace contract enables buying and selling of AI agent configurations. It allows users to:

- List agents for sale
- Purchase agents
- Update listing details
- Remove listings

## Development

### Prerequisites

- Rust 1.60.0+
- [wasmd](https://github.com/CosmWasm/wasmd) for local testing
- [Injective CLI](https://docs.injective.network/develop/tools/injectived) for deployment

### Building

To build the contracts:

```bash
# Build the agent registry contract
cd agent-registry
cargo wasm

# Build the marketplace contract
cd ../marketplace
cargo wasm
```

### Testing

To run the tests:

```bash
# Test the agent registry contract
cd agent-registry
cargo test

# Test the marketplace contract
cd ../marketplace
cargo test
```

### Deployment

To deploy the contracts to the Injective testnet:

1. Optimize the WASM files:

```bash
docker run --rm -v "$(pwd)":/code \
  --mount type=volume,source="$(basename "$(pwd)")_cache",target=/code/target \
  --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
  cosmwasm/rust-optimizer:0.12.8
```

2. Deploy using the Injective CLI:

```bash
injectived tx wasm store artifacts/axiom_agent_registry.wasm --from <your-key> --chain-id injective-888 --gas-prices 500000000inj --gas-adjustment 1.3 --gas auto --broadcast-mode block -y

injectived tx wasm store artifacts/axiom_marketplace.wasm --from <your-key> --chain-id injective-888 --gas-prices 500000000inj --gas-adjustment 1.3 --gas auto --broadcast-mode block -y
```

3. Instantiate the contracts:

```bash
# Instantiate the agent registry
injectived tx wasm instantiate <code-id> '{}' --from <your-key> --label "Axiom Agent Registry" --chain-id injective-888 --gas-prices 500000000inj --gas-adjustment 1.3 --gas auto --broadcast-mode block -y

# Instantiate the marketplace
injectived tx wasm instantiate <code-id> '{"fee_percentage":"5"}' --from <your-key> --label "Axiom Marketplace" --chain-id injective-888 --gas-prices 500000000inj --gas-adjustment 1.3 --gas auto --broadcast-mode block -y
``` 