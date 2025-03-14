const Agent = require('../models/Agent');

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
    const agent = await Agent.findById(req.params.id);
    
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    
    res.status(200).json(agent);
  } catch (error) {
    console.error('Error fetching agent:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
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
    const { name, description, configuration, status } = req.body;
    
    const agent = await Agent.findById(req.params.id);
    
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    
    // Update fields if provided
    if (name) agent.name = name;
    if (description) agent.description = description;
    if (configuration) agent.configuration = configuration;
    if (status) agent.status = status;
    
    const updatedAgent = await agent.save();
    res.status(200).json(updatedAgent);
  } catch (error) {
    console.error('Error updating agent:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
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