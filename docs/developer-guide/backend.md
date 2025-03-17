# Backend Development

This document provides guidelines and information for developers working on the Axiom platform's backend.

## Technologies

The backend is built using the following technologies:

- **Node.js**: JavaScript runtime
- **Express**: Web framework for Node.js
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **Injective.js**: JavaScript library for Injective blockchain interaction

## Project Structure

```
backend/
├── node_modules/
├── src/
│   ├── config/       # Configuration files
│   ├── controllers/  # Request handlers
│   ├── middleware/   # Express middleware
│   ├── models/       # Mongoose models
│   ├── routes/       # API routes
│   ├── services/     # Business logic
│   ├── utils/        # Utility functions
│   ├── app.js        # Express application setup
│   └── server.js     # Entry point
├── package.json
└── ...
```

## Key Components

### Controllers

Controllers handle incoming HTTP requests and return responses:

```javascript
// src/controllers/agentController.js
const Agent = require('../models/agent');
const { generateAgentConfig } = require('../services/agentService');

// Get all agents
exports.getAgents = async (req, res) => {
  try {
    const agents = await Agent.find({ owner: req.user.address });
    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new agent
exports.createAgent = async (req, res) => {
  try {
    const agent = new Agent({
      ...req.body,
      owner: req.user.address,
    });
    await agent.save();
    res.status(201).json(agent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Generate agent configuration
exports.generateConfig = async (req, res) => {
  try {
    const config = await generateAgentConfig(req.body);
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

### Routes

Routes define the API endpoints:

```javascript
// src/routes/agentRoutes.js
const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');
const auth = require('../middleware/auth');

// Public routes
router.get('/templates', agentController.getTemplates);

// Protected routes
router.get('/', auth, agentController.getAgents);
router.get('/:id', auth, agentController.getAgent);
router.post('/', auth, agentController.createAgent);
router.post('/generate-config', auth, agentController.generateConfig);
router.post('/:id/deploy', auth, agentController.deployAgent);
router.put('/:id', auth, agentController.updateAgent);
router.delete('/:id', auth, agentController.deleteAgent);

module.exports = router;
```

### Models

Models define the database schema:

```javascript
// src/models/agent.js
const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  configuration: {
    capabilities: {
      type: Map,
      of: Boolean,
    },
    parameters: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Agent', agentSchema);
```

### Services

Services contain the business logic:

```javascript
// src/services/agentService.js
const { InjectiveClient } = require('@injectivelabs/sdk-ts');
const iAgent = require('../utils/iAgent');

// Generate agent configuration
exports.generateAgentConfig = async (data) => {
  try {
    const config = await iAgent.generateConfig(data);
    return config;
  } catch (error) {
    throw new Error(`Error generating agent config: ${error.message}`);
  }
};

// Deploy agent to blockchain
exports.deployAgent = async (agent, network, options) => {
  try {
    const client = new InjectiveClient(network);
    // Deployment logic
    const result = await client.deployContract(agent.configuration, options);
    return result;
  } catch (error) {
    throw new Error(`Error deploying agent: ${error.message}`);
  }
};
```

## Authentication

The backend uses JWT for authentication:

```javascript
// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};
```

Wallet-based authentication:

```javascript
// src/controllers/authController.js
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { verifySignature } = require('../utils/crypto');
const config = require('../config');

// Generate a nonce for wallet signing
exports.getNonce = async (req, res) => {
  const { address } = req.body;
  if (!address) {
    return res.status(400).json({ message: 'Address is required' });
  }

  const nonce = crypto.randomBytes(32).toString('hex');
  // Store nonce in cache or database
  nonceCache.set(address, nonce);

  res.json({ nonce });
};

// Login with wallet signature
exports.login = async (req, res) => {
  const { address, signature, nonce } = req.body;
  if (!address || !signature || !nonce) {
    return res.status(400).json({ message: 'Address, signature, and nonce are required' });
  }

  // Get stored nonce
  const storedNonce = nonceCache.get(address);
  if (!storedNonce || storedNonce !== nonce) {
    return res.status(401).json({ message: 'Invalid nonce' });
  }

  // Verify signature
  const isValid = verifySignature(address, nonce, signature);
  if (!isValid) {
    return res.status(401).json({ message: 'Invalid signature' });
  }

  // Generate JWT
  const token = jwt.sign({ address }, config.jwtSecret, { expiresIn: '24h' });
  res.json({ token, expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) });
};
```

## Blockchain Integration

Integration with the Injective blockchain:

```javascript
// src/utils/blockchain.js
const { InjectiveClient } = require('@injectivelabs/sdk-ts');

// Create a client instance
const createClient = (network) => {
  return new InjectiveClient(network);
};

// Get wallet balance
exports.getWalletBalance = async (address, network = 'mainnet') => {
  const client = createClient(network);
  const balance = await client.getAccountBalance(address);
  return balance;
};

// Deploy contract
exports.deployContract = async (config, options, network = 'mainnet') => {
  const client = createClient(network);
  const result = await client.deployContract(config, options);
  return result;
};

// Execute contract
exports.executeContract = async (contractAddress, msg, options, network = 'mainnet') => {
  const client = createClient(network);
  const result = await client.executeContract(contractAddress, msg, options);
  return result;
};
```

## Error Handling

Consistent error handling:

```javascript
// src/utils/errorHandler.js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Global error handler middleware
exports.errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // Production error
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      // Programming or unknown error
      console.error('ERROR 💥', err);
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong',
      });
    }
  }
};

exports.AppError = AppError;
```

## API Documentation

API documentation is generated using Swagger:

```javascript
// src/app.js
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();

// API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
```

## Environment Configuration

Environment configuration is managed using dotenv:

```javascript
// src/config/index.js
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/axiom',
  jwtSecret: process.env.JWT_SECRET || 'secret',
  injectiveRpc: process.env.INJECTIVE_RPC || 'https://sentry.lcd.injective.network',
  iAgentUrl: process.env.IAGENT_URL || 'http://localhost:8000',
};
```

## Testing

Testing is done with Jest:

```javascript
// src/tests/agent.test.js
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Agent = require('../models/agent');
const jwt = require('jsonwebtoken');
const config = require('../config');

describe('Agent API', () => {
  let token;
  const testAddress = 'inj1test123';

  beforeAll(async () => {
    // Create test token
    token = jwt.sign({ address: testAddress }, config.jwtSecret);
    // Connect to test database
    await mongoose.connect(config.mongoUri + '_test');
  });

  afterAll(async () => {
    // Disconnect from test database
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear agents collection
    await Agent.deleteMany({});
  });

  test('GET /api/agents should return agents for user', async () => {
    // Create test agent
    await Agent.create({
      name: 'Test Agent',
      description: 'Test Description',
      owner: testAddress,
      category: 'finance',
    });

    const res = await request(app)
      .get('/api/agents')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe('Test Agent');
  });
});
```

## Deployment

The backend can be deployed using Docker:

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "src/server.js"]
```

## Best Practices

1. **Modular Design**: Keep code modular and focused
2. **Middleware**: Use middleware for cross-cutting concerns
3. **Error Handling**: Implement consistent error handling
4. **Validation**: Validate incoming requests
5. **Security**: Follow security best practices
6. **Logging**: Implement proper logging
7. **Testing**: Write tests for all endpoints
8. **Documentation**: Keep API documentation up to date

## Contributing

When contributing to the backend:

1. Follow the established code style and patterns
2. Create new modules in the appropriate directories
3. Update documentation when adding new features
4. Write tests for new functionality
5. Test your changes thoroughly before submitting a pull request 