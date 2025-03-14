const Agent = require('../models/Agent');
const injectiveService = require('../services/injectiveService');

// List all agents in the marketplace
exports.listMarketplaceAgents = async (req, res) => {
  try {
    const { category, price_min, price_max, sort_by, sort_dir } = req.query;
    
    // Build query
    const query = { 'marketplace.isListed': true };
    
    if (category) {
      query['marketplace.category'] = category;
    }
    
    if (price_min || price_max) {
      query['marketplace.price'] = {};
      if (price_min) query['marketplace.price'].$gte = Number(price_min);
      if (price_max) query['marketplace.price'].$lte = Number(price_max);
    }
    
    // Build sort options
    let sortOptions = {};
    if (sort_by) {
      const direction = sort_dir === 'desc' ? -1 : 1;
      switch (sort_by) {
        case 'price':
          sortOptions['marketplace.price'] = direction;
          break;
        case 'rating':
          sortOptions['marketplace.rating'] = direction;
          break;
        case 'created_at':
          sortOptions['createdAt'] = direction;
          break;
        default:
          sortOptions['createdAt'] = -1;
      }
    } else {
      sortOptions['createdAt'] = -1;
    }
    
    const agents = await Agent.find(query).sort(sortOptions);
    
    res.status(200).json(agents);
  } catch (error) {
    console.error('Error listing marketplace agents:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a single marketplace agent by ID
exports.getMarketplaceAgent = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    
    if (!agent.marketplace.isListed) {
      return res.status(400).json({ message: 'Agent is not listed in the marketplace' });
    }
    
    res.status(200).json(agent);
  } catch (error) {
    console.error('Error getting marketplace agent:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// List an agent in the marketplace
exports.listAgentInMarketplace = async (req, res) => {
  try {
    const { agentId, price, category, mnemonic } = req.body;
    
    if (!agentId || !price || !category || !mnemonic) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Find the agent in the database
    const agent = await Agent.findById(agentId);
    
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    
    // Check if agent is already listed
    if (agent.marketplace.isListed) {
      return res.status(400).json({ message: 'Agent is already listed in the marketplace' });
    }
    
    // List agent on the blockchain
    try {
      const txResult = await injectiveService.listAgentInMarketplace(
        mnemonic,
        agent.name,
        agent.description,
        price.toString(),
        category
      );
      
      // Update agent in the database
      agent.marketplace = {
        isListed: true,
        price: Number(price),
        category,
        downloads: 0,
        rating: 0,
      };
      
      const updatedAgent = await agent.save();
      
      res.status(200).json({
        message: 'Agent listed in marketplace successfully',
        agent: updatedAgent,
        transaction: txResult
      });
    } catch (blockchainError) {
      console.error('Blockchain error:', blockchainError);
      res.status(500).json({ 
        message: 'Error listing agent on blockchain', 
        error: blockchainError.message 
      });
    }
  } catch (error) {
    console.error('Error listing agent in marketplace:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Remove an agent from the marketplace
exports.removeAgentFromMarketplace = async (req, res) => {
  try {
    const { agentId } = req.params;
    const { mnemonic } = req.body;
    
    if (!agentId || !mnemonic) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Find the agent in the database
    const agent = await Agent.findById(agentId);
    
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    
    // Check if agent is listed
    if (!agent.marketplace.isListed) {
      return res.status(400).json({ message: 'Agent is not listed in the marketplace' });
    }
    
    // Remove agent from the blockchain marketplace
    try {
      const contractAddress = process.env.MARKETPLACE_CONTRACT_ADDRESS;
      const msg = {
        remove_agent: {
          agent_id: agentId
        }
      };
      
      const txResult = await injectiveService.executeContract(mnemonic, contractAddress, msg);
      
      // Update agent in the database
      agent.marketplace.isListed = false;
      
      const updatedAgent = await agent.save();
      
      res.status(200).json({
        message: 'Agent removed from marketplace successfully',
        agent: updatedAgent,
        transaction: txResult
      });
    } catch (blockchainError) {
      console.error('Blockchain error:', blockchainError);
      res.status(500).json({ 
        message: 'Error removing agent from blockchain marketplace', 
        error: blockchainError.message 
      });
    }
  } catch (error) {
    console.error('Error removing agent from marketplace:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Purchase an agent from the marketplace
exports.purchaseAgent = async (req, res) => {
  try {
    const { agentId, mnemonic } = req.body;
    
    if (!agentId || !mnemonic) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Find the agent in the database
    const agent = await Agent.findById(agentId);
    
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    
    // Check if agent is listed
    if (!agent.marketplace.isListed) {
      return res.status(400).json({ message: 'Agent is not listed in the marketplace' });
    }
    
    // Purchase agent on the blockchain
    try {
      const txResult = await injectiveService.purchaseAgent(
        mnemonic,
        agentId,
        agent.marketplace.price.toString()
      );
      
      // Update agent in the database
      agent.marketplace.downloads += 1;
      
      const updatedAgent = await agent.save();
      
      // Create a copy of the agent for the buyer
      const buyerWallet = injectiveService.createWalletFromMnemonic(mnemonic);
      
      const buyerAgent = new Agent({
        name: agent.name,
        description: agent.description,
        owner: buyerWallet.address,
        configuration: agent.configuration,
        status: 'draft',
      });
      
      await buyerAgent.save();
      
      res.status(200).json({
        message: 'Agent purchased successfully',
        agent: buyerAgent,
        transaction: txResult
      });
    } catch (blockchainError) {
      console.error('Blockchain error:', blockchainError);
      res.status(500).json({ 
        message: 'Error purchasing agent on blockchain', 
        error: blockchainError.message 
      });
    }
  } catch (error) {
    console.error('Error purchasing agent:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Rate an agent in the marketplace
exports.rateAgent = async (req, res) => {
  try {
    const { agentId, rating } = req.body;
    
    if (!agentId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ 
        message: 'Missing required fields or invalid rating (must be between 1 and 5)' 
      });
    }
    
    // Find the agent in the database
    const agent = await Agent.findById(agentId);
    
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    
    // Check if agent is listed
    if (!agent.marketplace.isListed) {
      return res.status(400).json({ message: 'Agent is not listed in the marketplace' });
    }
    
    // Calculate new rating (simple average for now)
    // In a real app, you would store individual ratings and calculate the average
    const currentRating = agent.marketplace.rating || 0;
    const downloads = agent.marketplace.downloads || 0;
    
    let newRating;
    if (downloads === 0) {
      newRating = rating;
    } else {
      // Simple weighted average
      newRating = ((currentRating * downloads) + rating) / (downloads + 1);
    }
    
    // Update agent in the database
    agent.marketplace.rating = newRating;
    
    const updatedAgent = await agent.save();
    
    res.status(200).json({
      message: 'Agent rated successfully',
      agent: updatedAgent
    });
  } catch (error) {
    console.error('Error rating agent:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 