const Agent = require('../models/Agent');
const InjectiveService = require('../services/injectiveService');
const injectiveService = new InjectiveService();

// Get all agents for a user
exports.getAgents = async (req, res) => {
  try {
    const { owner } = req.query;
    
    if (!owner) {
      return res.status(400).json({ message: 'Owner address is required' });
    }
    
    const agents = await Agent.find({ owner });
    res.status(200).json(agents);
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a single agent by ID
exports.getAgentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    try {
      // Try to get the agent from the blockchain
      const agent = await injectiveService.getAgentById(id);
      res.json(agent);
    } catch (blockchainError) {
      console.error('Error fetching from blockchain:', blockchainError);
      
      // Fallback to mock data for development
      const agent = {
        id,
        name: `Agent ${id}`,
        description: 'This is a sample agent description.',
        capabilities: [
          "web_search",
          "data_analysis",
          "natural_language_processing"
        ],
        parameters: {
          response_time: "fast",
          accuracy: "high",
          learning_rate: 0.01
        },
        created_at: new Date().toISOString(),
        status: 'active'
      };
      
      res.json(agent);
    }
  } catch (error) {
    console.error('Error fetching agent:', error);
    res.status(500).json({ error: 'Failed to fetch agent' });
  }
};

// Create a new agent
exports.createAgent = async (req, res) => {
  try {
    const { name, description, owner, configuration } = req.body;
    
    if (!name || !description || !owner || !configuration) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const newAgent = new Agent({
      name,
      description,
      owner,
      configuration,
    });
    
    const savedAgent = await newAgent.save();
    res.status(201).json(savedAgent);
  } catch (error) {
    console.error('Error creating agent:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update an agent
exports.updateAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { mnemonic } = req.headers;
    
    if (!mnemonic) {
      // For development without a mnemonic, return a mock response
      const updatedAgent = {
        id,
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      return res.json(updatedAgent);
    }
    
    // In a real implementation, this would update the agent on the blockchain
    // For now, we'll just return a mock response
    const updatedAgent = {
      id,
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    res.json(updatedAgent);
  } catch (error) {
    console.error('Error updating agent:', error);
    res.status(500).json({ error: 'Failed to update agent' });
  }
};

// Delete an agent
exports.deleteAgent = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    
    await Agent.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Agent deleted successfully' });
  } catch (error) {
    console.error('Error deleting agent:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Generate agent configuration based on name and description
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.generateConfig = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }
    
    // Generate a configuration based on the name and description
    // In a real implementation, this might use AI to generate a more sophisticated config
    const config = {
      name,
      description,
      capabilities: [
        "web_search",
        "data_analysis",
        "natural_language_processing"
      ],
      parameters: {
        response_time: "fast",
        accuracy: "high",
        learning_rate: 0.01
      },
      created_at: new Date().toISOString(),
      version: "1.0.0"
    };
    
    res.json(config);
  } catch (error) {
    console.error('Error generating agent configuration:', error);
    res.status(500).json({ error: 'Failed to generate agent configuration' });
  }
};

/**
 * Save an agent to the registry
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.saveAgent = async (req, res) => {
  try {
    const agentConfig = req.body;
    const { mnemonic } = req.headers;
    
    if (!agentConfig.name || !agentConfig.description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }
    
    if (!mnemonic) {
      // For development without a mnemonic, return a mock response
      const savedAgent = {
        id: `agent-${Date.now()}`,
        ...agentConfig,
        created_at: new Date().toISOString(),
        status: agentConfig.status || 'active'
      };
      
      return res.json(savedAgent);
    }
    
    // Register the agent on the blockchain
    const result = await injectiveService.registerAgent(
      mnemonic,
      agentConfig.name,
      agentConfig.description,
      JSON.stringify(agentConfig)
    );
    
    // Extract the agent ID from the transaction result
    // In a real implementation, you would parse the transaction logs
    const agentId = `agent-${Date.now()}`;
    
    const savedAgent = {
      id: agentId,
      ...agentConfig,
      created_at: new Date().toISOString(),
      status: agentConfig.status || 'active',
      transaction_hash: result.txHash
    };
    
    res.json(savedAgent);
  } catch (error) {
    console.error('Error saving agent:', error);
    res.status(500).json({ error: 'Failed to save agent' });
  }
};

/**
 * Get agent templates
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getTemplates = async (req, res) => {
  try {
    // In a real implementation, these would come from a database or blockchain
    const templates = [
      {
        id: 'template-1',
        name: 'Market Monitor',
        description: 'Monitors cryptocurrency markets and sends alerts based on price movements.',
        category: 'finance',
        config: {
          name: 'Market Monitor',
          description: 'Monitors cryptocurrency markets and sends alerts based on price movements.',
          capabilities: [
            "market_data",
            "price_alerts",
            "technical_analysis"
          ],
          parameters: {
            update_frequency: "1m",
            alert_threshold: 0.05,
            markets: ["INJ/USDT", "BTC/USDT", "ETH/USDT"]
          }
        }
      },
      {
        id: 'template-2',
        name: 'Data Analyzer',
        description: 'Analyzes on-chain data and generates insights and visualizations.',
        category: 'analytics',
        config: {
          name: 'Data Analyzer',
          description: 'Analyzes on-chain data and generates insights and visualizations.',
          capabilities: [
            "blockchain_data",
            "data_visualization",
            "pattern_recognition"
          ],
          parameters: {
            data_sources: ["transactions", "smart_contracts", "defi_protocols"],
            analysis_depth: "deep",
            visualization_types: ["charts", "graphs", "heatmaps"]
          }
        }
      },
      {
        id: 'template-3',
        name: 'Trading Bot',
        description: 'Executes trades based on predefined strategies and market conditions.',
        category: 'trading',
        config: {
          name: 'Trading Bot',
          description: 'Executes trades based on predefined strategies and market conditions.',
          capabilities: [
            "market_analysis",
            "trade_execution",
            "risk_management"
          ],
          parameters: {
            strategy: "momentum",
            position_size: 0.1,
            stop_loss: 0.03,
            take_profit: 0.05
          }
        }
      }
    ];
    
    res.json(templates);
  } catch (error) {
    console.error('Error fetching agent templates:', error);
    res.status(500).json({ error: 'Failed to fetch agent templates' });
  }
};

/**
 * Deploy an agent
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deployAgent = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get the agent configuration
    let agentConfig;
    try {
      // Try to get the agent from the blockchain
      agentConfig = await injectiveService.getAgentById(id);
    } catch (blockchainError) {
      console.error('Error fetching from blockchain:', blockchainError);
      
      // Fallback to mock data for development
      agentConfig = {
        id,
        name: `Agent ${id}`,
        description: 'This is a sample agent description.',
        capabilities: [
          "web_search",
          "data_analysis",
          "natural_language_processing"
        ],
        parameters: {
          response_time: "fast",
          accuracy: "high",
          learning_rate: 0.01
        }
      };
    }
    
    // Deploy the agent to iAgent
    try {
      const deploymentResult = await injectiveService.deployAgentToIAgent(id, agentConfig);
      
      const deployedAgent = {
        id,
        deployment_id: deploymentResult.deployment_id || `deploy-${Date.now()}`,
        status: 'deployed',
        deployed_at: new Date().toISOString(),
        ...deploymentResult
      };
      
      res.json(deployedAgent);
    } catch (deployError) {
      console.error('Error deploying to iAgent:', deployError);
      
      // Fallback to mock data for development
      const deployedAgent = {
        id,
        deployment_id: `deploy-${Date.now()}`,
        status: 'deployed',
        deployed_at: new Date().toISOString()
      };
      
      res.json(deployedAgent);
    }
  } catch (error) {
    console.error('Error deploying agent:', error);
    res.status(500).json({ error: 'Failed to deploy agent' });
  }
}; 