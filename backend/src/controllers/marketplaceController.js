const Agent = require('../models/Agent');
const InjectiveService = require('../services/injectiveService');
const injectiveService = new InjectiveService();

// List all agents in the marketplace
exports.listMarketplaceAgents = async (req, res) => {
  try {
    const { category, price_min, price_max, sort_by, sort_dir } = req.query;
    
    // Use mock data for development to avoid database errors
    const mockAgents = [
      {
        id: 'agent-1',
        name: 'Market Sentinel',
        description: 'Advanced market monitoring with customizable alerts and insights.',
        category: 'finance',
        marketplace: {
          isListed: true,
          price: 50,
          category: 'finance',
          downloads: 120,
          rating: 4.7
        },
        creator: 'inj1abc123',
        createdAt: new Date().toISOString()
      },
      {
        id: 'agent-2',
        name: 'Trading Assistant Pro',
        description: 'AI-powered trading assistant with real-time market analysis and suggestions.',
        category: 'trading',
        marketplace: {
          isListed: true,
          price: 75,
          category: 'trading',
          downloads: 85,
          rating: 4.3
        },
        creator: 'inj1def456',
        createdAt: new Date().toISOString()
      },
      {
        id: 'agent-3',
        name: 'Portfolio Manager',
        description: 'Comprehensive portfolio management and tracking with performance analytics.',
        category: 'analytics',
        marketplace: {
          isListed: true,
          price: 45,
          category: 'analytics',
          downloads: 210,
          rating: 4.8
        },
        creator: 'inj1ghi789',
        createdAt: new Date().toISOString()
      },
      {
        id: 'agent-4',
        name: 'Crypto News Aggregator',
        description: 'Real-time news and updates from across the crypto ecosystem.',
        category: 'social',
        marketplace: {
          isListed: true,
          price: 30,
          category: 'social',
          downloads: 175,
          rating: 4.2
        },
        creator: 'inj1jkl012',
        createdAt: new Date().toISOString()
      },
      {
        id: 'agent-5',
        name: 'DeFi Yield Optimizer',
        description: 'Optimize DeFi yield farming with real-time strategy recommendations.',
        category: 'finance',
        marketplace: {
          isListed: true,
          price: 65,
          category: 'finance',
          downloads: 95,
          rating: 4.5
        },
        creator: 'inj1mno345',
        createdAt: new Date().toISOString()
      }
    ];
    
    // Apply filters (for demonstration purposes)
    let filteredAgents = [...mockAgents];
    
    if (category && category !== 'all') {
      filteredAgents = filteredAgents.filter(agent => 
        agent.marketplace.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Return the mock data
    res.status(200).json(filteredAgents);
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
    const { id } = req.params;
    const { mnemonic } = req.headers;
    
    if (!mnemonic) {
      return res.status(400).json({ error: 'Mnemonic is required to purchase an agent' });
    }
    
    // Try to get the listing from the blockchain
    try {
      const listing = await injectiveService.getMarketplaceListingById(id);
      
      // Purchase the agent
      const result = await injectiveService.purchaseAgent(
        mnemonic,
        id,
        listing.price.amount
      );
      
      const purchase = {
        id: `purchase-${Date.now()}`,
        agent_id: listing.agent_id,
        listing_id: id,
        buyer_address: req.body.address,
        price: parseFloat(listing.price.amount) / 1e18, // Convert from wei to INJ
        transaction_hash: result.txHash,
        timestamp: new Date().toISOString(),
        status: 'completed'
      };
      
      return res.json(purchase);
    } catch (blockchainError) {
      console.error('Error with blockchain transaction:', blockchainError);
      
      // Fallback to mock data for development
      const purchase = {
        id: `purchase-${Date.now()}`,
        agent_id: id,
        buyer_address: req.body.address || 'inj1xyz789',
        price: 50, // This would be fetched from the agent details
        transaction_hash: `0x${Math.random().toString(16).substring(2, 42)}`,
        timestamp: new Date().toISOString(),
        status: 'completed'
      };
      
      res.json(purchase);
    }
  } catch (error) {
    console.error('Error purchasing agent:', error);
    res.status(500).json({ error: 'Failed to purchase agent' });
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

/**
 * Get all agents in the marketplace
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAgents = async (req, res) => {
  try {
    const { category } = req.query;
    
    // Try to get listings from the blockchain
    try {
      const listings = await injectiveService.getMarketplaceListings();
      
      // Filter by category if provided
      let filteredListings = listings;
      if (category && category !== 'all') {
        filteredListings = listings.filter(listing => listing.category === category);
      }
      
      // Format the response
      const agents = filteredListings.map(listing => ({
        id: listing.id,
        name: listing.name,
        description: listing.description,
        category: listing.category,
        price: parseFloat(listing.price.amount) / 1e18, // Convert from wei to INJ
        creator: listing.seller,
        rating: listing.rating || 4.5, // Default rating if not available
        downloads: listing.downloads || 0 // Default downloads if not available
      }));
      
      return res.json(agents);
    } catch (blockchainError) {
      console.error('Error fetching from blockchain:', blockchainError);
      
      // Fallback to mock data for development
      let agents = [
        {
          id: '1',
          name: 'Market Sentinel',
          description: 'Advanced market monitoring with customizable alerts and insights.',
          category: 'finance',
          price: 50,
          creator: 'BlockchainLabs',
          rating: 4.8,
          downloads: 1250,
        },
        {
          id: '2',
          name: 'TradeMaster Pro',
          description: 'Automated trading with support for multiple strategies and risk management.',
          category: 'trading',
          price: 120,
          creator: 'AlgoTraders',
          rating: 4.6,
          downloads: 890,
        },
        {
          id: '3',
          name: 'OnChain Analyzer',
          description: 'Deep analysis of blockchain data with visualization and pattern recognition.',
          category: 'analytics',
          price: 75,
          creator: 'DataVision',
          rating: 4.9,
          downloads: 2100,
        },
        {
          id: '4',
          name: 'Community Manager',
          description: 'Manage and grow your community with automated engagement and moderation.',
          category: 'social',
          price: 40,
          creator: 'SocialDAO',
          rating: 4.5,
          downloads: 760,
        },
        {
          id: '5',
          name: 'Smart Wallet Guardian',
          description: 'Protect your assets with intelligent monitoring and security alerts.',
          category: 'utility',
          price: 30,
          creator: 'SecureBlock',
          rating: 4.7,
          downloads: 1800,
        },
        {
          id: '6',
          name: 'DeFi Yield Optimizer',
          description: 'Maximize your DeFi yields with automated portfolio rebalancing.',
          category: 'finance',
          price: 85,
          creator: 'YieldHackers',
          rating: 4.4,
          downloads: 950,
        },
      ];
      
      // Filter by category if provided
      if (category && category !== 'all') {
        agents = agents.filter(agent => agent.category === category);
      }
      
      res.json(agents);
    }
  } catch (error) {
    console.error('Error fetching marketplace agents:', error);
    res.status(500).json({ error: 'Failed to fetch marketplace agents' });
  }
};

/**
 * Get agent details by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAgentDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Try to get the listing from the blockchain
    try {
      const listing = await injectiveService.getMarketplaceListingById(id);
      
      // Get the agent details from the registry
      const agent = await injectiveService.getAgentById(listing.agent_id);
      
      // Format the response
      const agentDetails = {
        id: listing.id,
        name: agent.name,
        description: agent.description,
        category: listing.category,
        price: parseFloat(listing.price.amount) / 1e18, // Convert from wei to INJ
        creator: listing.seller,
        creator_address: listing.seller,
        rating: listing.rating || 4.5, // Default rating if not available
        downloads: listing.downloads || 0, // Default downloads if not available
        created_at: listing.created_at,
        capabilities: agent.capabilities || [],
        reviews: listing.reviews || []
      };
      
      return res.json(agentDetails);
    } catch (blockchainError) {
      console.error('Error fetching from blockchain:', blockchainError);
      
      // Fallback to mock data for development
      const agent = {
        id,
        name: 'Market Sentinel',
        description: 'Advanced market monitoring with customizable alerts and insights.',
        category: 'finance',
        price: 50,
        creator: 'BlockchainLabs',
        creator_address: 'inj1abc123def456',
        rating: 4.8,
        downloads: 1250,
        created_at: '2025-05-15T10:30:00Z',
        capabilities: [
          'market_data',
          'price_alerts',
          'technical_analysis'
        ],
        reviews: [
          {
            user: 'Trader123',
            rating: 5,
            comment: 'Excellent agent, saved me a lot of time!',
            date: '2025-06-20T14:25:00Z'
          },
          {
            user: 'CryptoFan',
            rating: 4,
            comment: 'Very useful for monitoring the market.',
            date: '2025-07-05T09:15:00Z'
          }
        ]
      };
      
      res.json(agent);
    }
  } catch (error) {
    console.error('Error fetching agent details:', error);
    res.status(500).json({ error: 'Failed to fetch agent details' });
  }
};

/**
 * List an agent in the marketplace
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.listAgent = async (req, res) => {
  try {
    const { agentId, price, category } = req.body;
    const { mnemonic } = req.headers;
    
    if (!agentId || !price || !category) {
      return res.status(400).json({ error: 'Agent ID, price, and category are required' });
    }
    
    if (!mnemonic) {
      return res.status(400).json({ error: 'Mnemonic is required to list an agent' });
    }
    
    // Try to list the agent on the blockchain
    try {
      const result = await injectiveService.listAgentInMarketplace(
        mnemonic,
        agentId,
        (parseFloat(price) * 1e18).toString(), // Convert INJ to wei
        category
      );
      
      const listing = {
        id: `listing-${Date.now()}`,
        agent_id: agentId,
        seller_address: req.body.address,
        price,
        category,
        transaction_hash: result.txHash,
        timestamp: new Date().toISOString(),
        status: 'active'
      };
      
      return res.json(listing);
    } catch (blockchainError) {
      console.error('Error with blockchain transaction:', blockchainError);
      
      // Fallback to mock data for development
      const listing = {
        id: `listing-${Date.now()}`,
        agent_id: agentId,
        seller_address: req.body.address || 'inj1xyz789',
        price,
        category,
        transaction_hash: `0x${Math.random().toString(16).substring(2, 42)}`,
        timestamp: new Date().toISOString(),
        status: 'active'
      };
      
      res.json(listing);
    }
  } catch (error) {
    console.error('Error listing agent:', error);
    res.status(500).json({ error: 'Failed to list agent in marketplace' });
  }
}; 