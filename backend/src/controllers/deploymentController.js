const Agent = require('../models/Agent');
const { 
  getNetworkInfo, 
  createWallet, 
  getChainId, 
  getMsgClient 
} = require('@injectivelabs/sdk-ts');
const { Network } = require('@injectivelabs/networks');

// Deploy an agent to the Injective blockchain
exports.deployAgent = async (req, res) => {
  try {
    const { agentId, network, gasLimit, permissions } = req.body;
    
    if (!agentId || !network) {
      return res.status(400).json({ message: 'Agent ID and network are required' });
    }
    
    // Find the agent in the database
    const agent = await Agent.findById(agentId);
    
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    
    // Simulate deployment to Injective blockchain
    // In a real implementation, this would interact with the Injective blockchain
    // using the SDK to deploy the agent as a smart contract
    
    // For demo purposes, we'll just update the agent status and add deployment details
    agent.status = 'deployed';
    agent.deploymentDetails = {
      network,
      contractAddress: `inj1${Math.random().toString(36).substring(2, 15)}`,
      deploymentDate: new Date(),
      lastActive: new Date(),
      transactions: 0,
    };
    
    const updatedAgent = await agent.save();
    
    res.status(200).json({
      message: 'Agent deployed successfully',
      agent: updatedAgent,
    });
  } catch (error) {
    console.error('Error deploying agent:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get deployment status of an agent
exports.getDeploymentStatus = async (req, res) => {
  try {
    const { agentId } = req.params;
    
    if (!agentId) {
      return res.status(400).json({ message: 'Agent ID is required' });
    }
    
    // Find the agent in the database
    const agent = await Agent.findById(agentId);
    
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    
    // Return the deployment status and details
    res.status(200).json({
      status: agent.status,
      deploymentDetails: agent.deploymentDetails || null,
    });
  } catch (error) {
    console.error('Error getting deployment status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update an agent's deployment (e.g., deactivate, reactivate)
exports.updateDeployment = async (req, res) => {
  try {
    const { agentId } = req.params;
    const { action } = req.body;
    
    if (!agentId || !action) {
      return res.status(400).json({ message: 'Agent ID and action are required' });
    }
    
    // Find the agent in the database
    const agent = await Agent.findById(agentId);
    
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    
    // Perform the requested action
    switch (action) {
      case 'deactivate':
        agent.status = 'inactive';
        break;
      case 'reactivate':
        agent.status = 'deployed';
        break;
      default:
        return res.status(400).json({ message: 'Invalid action' });
    }
    
    const updatedAgent = await agent.save();
    
    res.status(200).json({
      message: `Agent ${action}d successfully`,
      agent: updatedAgent,
    });
  } catch (error) {
    console.error('Error updating deployment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get network information
exports.getNetworks = async (req, res) => {
  try {
    // Return available networks
    const networks = [
      {
        id: 'mainnet',
        name: 'Injective Mainnet',
        chainId: 'injective-1',
      },
      {
        id: 'testnet',
        name: 'Injective Testnet',
        chainId: 'injective-888',
      },
      {
        id: 'devnet',
        name: 'Injective Devnet',
        chainId: 'injective-777',
      },
    ];
    
    res.status(200).json(networks);
  } catch (error) {
    console.error('Error getting networks:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 