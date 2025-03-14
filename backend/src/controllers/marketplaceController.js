const Agent = require('../models/Agent');

// List all agents in the marketplace
exports.listMarketplaceAgents = async (req, res) => {
  try {
    const { category, search } = req.query;
    
    // Build the query
    const query = { 'marketplace.isListed': true };
    
    // Add category filter if provided
    if (category && category !== 'all') {
      query['marketplace.category'] = category;
    }
    
    // Add search filter if provided
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    
    // Find agents matching the query
    const agents = await Agent.find(query);
    
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
      return res.status(403).json({ message: 'Agent is not listed in the marketplace' });
    }
    
    res.status(200).json(agent);
  } catch (error) {
    console.error('Error fetching marketplace agent:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// List an agent in the marketplace
exports.listAgentInMarketplace = async (req, res) => {
  try {
    const { agentId, price, category } = req.body;
    
    if (!agentId || !price || !category) {
      return res.status(400).json({ message: 'Agent ID, price, and category are required' });
    }
    
    // Find the agent
    const agent = await Agent.findById(agentId);
    
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    
    // Update marketplace details
    agent.marketplace = {
      isListed: true,
      price,
      category,
      downloads: 0,
      rating: 0,
    };
    
    const updatedAgent = await agent.save();
    
    res.status(200).json({
      message: 'Agent listed in marketplace successfully',
      agent: updatedAgent,
    });
  } catch (error) {
    console.error('Error listing agent in marketplace:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Remove an agent from the marketplace
exports.removeAgentFromMarketplace = async (req, res) => {
  try {
    const { agentId } = req.params;
    
    // Find the agent
    const agent = await Agent.findById(agentId);
    
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    
    // Update marketplace details
    agent.marketplace.isListed = false;
    
    const updatedAgent = await agent.save();
    
    res.status(200).json({
      message: 'Agent removed from marketplace successfully',
      agent: updatedAgent,
    });
  } catch (error) {
    console.error('Error removing agent from marketplace:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Purchase an agent from the marketplace
exports.purchaseAgent = async (req, res) => {
  try {
    const { agentId, buyerAddress } = req.body;
    
    if (!agentId || !buyerAddress) {
      return res.status(400).json({ message: 'Agent ID and buyer address are required' });
    }
    
    // Find the agent
    const agent = await Agent.findById(agentId);
    
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    
    if (!agent.marketplace.isListed) {
      return res.status(403).json({ message: 'Agent is not listed in the marketplace' });
    }
    
    // In a real implementation, this would handle the blockchain transaction
    // for transferring ownership and payment
    
    // For demo purposes, we'll create a new agent for the buyer
    const newAgent = new Agent({
      name: agent.name,
      description: agent.description,
      owner: buyerAddress,
      configuration: agent.configuration,
      status: 'draft',
    });
    
    // Save the new agent
    const savedAgent = await newAgent.save();
    
    // Update the original agent's marketplace stats
    agent.marketplace.downloads += 1;
    await agent.save();
    
    res.status(200).json({
      message: 'Agent purchased successfully',
      agent: savedAgent,
    });
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
      return res.status(400).json({ message: 'Agent ID and valid rating (1-5) are required' });
    }
    
    // Find the agent
    const agent = await Agent.findById(agentId);
    
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    
    if (!agent.marketplace.isListed) {
      return res.status(403).json({ message: 'Agent is not listed in the marketplace' });
    }
    
    // In a real implementation, this would track individual user ratings
    // and calculate an average
    
    // For demo purposes, we'll just update the rating directly
    agent.marketplace.rating = rating;
    
    const updatedAgent = await agent.save();
    
    res.status(200).json({
      message: 'Agent rated successfully',
      agent: updatedAgent,
    });
  } catch (error) {
    console.error('Error rating agent:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 