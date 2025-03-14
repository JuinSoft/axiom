# Axiom Backend

This is the backend server for the Axiom platform, a no-code solution for creating AI agents on the Injective blockchain.

## Prerequisites

Before running the backend, make sure you have the following installed:

- Node.js (v16 or higher)
- npm (v7 or higher)
- MongoDB (v4.4 or higher)
- Injective CLI (for blockchain interactions)

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/axiom.git
cd axiom/backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add the following variables:

```
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/axiom

# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key

# Injective Configuration
INJECTIVE_NETWORK=testnet
INJECTIVE_CHAIN_ID=injective-888
INJECTIVE_RPC_ENDPOINT=https://testnet.tm.injective.network
INJECTIVE_REST_ENDPOINT=https://testnet.lcd.injective.network

# Contract Addresses
MARKETPLACE_CONTRACT_ADDRESS=inj1...
AGENT_REGISTRY_CONTRACT_ADDRESS=inj1...

# JWT Secret for Authentication
JWT_SECRET=your_jwt_secret
```

## MongoDB Setup

1. Install MongoDB:
   - For macOS: `brew install mongodb-community`
   - For Ubuntu: `sudo apt install mongodb`
   - For Windows: Download and install from [MongoDB website](https://www.mongodb.com/try/download/community)

2. Start MongoDB service:
   - For macOS: `brew services start mongodb-community`
   - For Ubuntu: `sudo systemctl start mongodb`
   - For Windows: MongoDB runs as a service after installation

3. Verify MongoDB is running:
```bash
mongo --eval "db.version()"
```

## Running the Server

1. Start the development server:
```bash
npm run dev
```

2. The server will be available at `http://localhost:5000`

## API Endpoints

### Agents
- `GET /api/agents` - Get all agents for a user
- `GET /api/agents/:id` - Get a single agent by ID
- `POST /api/agents` - Create a new agent
- `PUT /api/agents/:id` - Update an agent
- `DELETE /api/agents/:id` - Delete an agent

### AI
- `POST /api/ai/generate-config` - Generate agent configuration from description
- `POST /api/ai/optimize-config` - Optimize agent configuration

### Deployment
- `POST /api/deployment/deploy` - Deploy an agent to the blockchain
- `GET /api/deployment/status/:agentId` - Get deployment status of an agent
- `PUT /api/deployment/:agentId` - Update an agent's deployment
- `GET /api/deployment/networks` - Get available networks

### Marketplace
- `GET /api/marketplace` - List all agents in the marketplace
- `GET /api/marketplace/:id` - Get a single marketplace agent by ID
- `POST /api/marketplace/list` - List an agent in the marketplace
- `DELETE /api/marketplace/:agentId` - Remove an agent from the marketplace
- `POST /api/marketplace/purchase` - Purchase an agent from the marketplace
- `POST /api/marketplace/rate` - Rate an agent in the marketplace

## Injective Blockchain Integration

The backend integrates with the Injective blockchain using the `@injectivelabs/sdk-ts` package. To interact with the blockchain:

1. Make sure you have the Injective CLI installed:
```bash
npm install -g @injectivelabs/cli
```

2. Configure your Injective network:
```bash
injectived config chain-id injective-888
injectived config node https://testnet.tm.injective.network
```

3. Set up your wallet:
```bash
injectived keys add my-wallet
```

## Testing

Run tests with:
```bash
npm test
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `ps aux | grep mongo`
- Check MongoDB logs: `tail -f /var/log/mongodb/mongodb.log`
- Verify connection string in `.env` file

### OpenAI API Issues
- Verify your API key is correct
- Check API usage limits
- Ensure proper network connectivity

### Injective Blockchain Issues
- Verify network configuration
- Check wallet balance for transaction fees
- Ensure contract addresses are correct 