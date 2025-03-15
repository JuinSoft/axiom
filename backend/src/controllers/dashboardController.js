const InjectiveService = require('../services/injectiveService');
const injectiveService = new InjectiveService();

/**
 * Get user's agents
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAgents = async (req, res) => {
  try {
    const { address } = req.query;
    
    if (!address) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }
    
    // Try to get agents from the blockchain
    try {
      // Get all agents from the registry
      const allAgents = await injectiveService.getAllAgents();
      
      // Filter agents owned by the user
      const userAgents = allAgents.filter(agent => agent.owner === address);
      
      // Format the response
      const agents = userAgents.map(agent => ({
        id: agent.id,
        name: agent.name,
        description: agent.description,
        category: agent.category || 'other',
        status: agent.status || 'active',
        created_at: agent.created_at,
        last_active: agent.last_active || new Date().toISOString()
      }));
      
      return res.json(agents);
    } catch (blockchainError) {
      console.error('Error fetching from blockchain:', blockchainError);
      
      // Fallback to mock data for development
      const agents = [
        {
          id: 'agent-1',
          name: 'Market Monitor',
          description: 'Monitors cryptocurrency markets and sends alerts based on price movements.',
          category: 'finance',
          status: 'active',
          created_at: '2023-05-15T10:30:00Z',
          last_active: '2023-08-10T14:22:00Z'
        },
        {
          id: 'agent-2',
          name: 'Trading Assistant',
          description: 'Helps with trading decisions by analyzing market data and trends.',
          category: 'trading',
          status: 'inactive',
          created_at: '2023-06-20T08:15:00Z',
          last_active: '2023-07-30T11:45:00Z'
        },
        {
          id: 'agent-3',
          name: 'Portfolio Tracker',
          description: 'Tracks your portfolio performance and provides insights.',
          category: 'analytics',
          status: 'active',
          created_at: '2023-07-05T16:40:00Z',
          last_active: '2023-08-09T22:10:00Z'
        }
      ];
      
      res.json(agents);
    }
  } catch (error) {
    console.error('Error fetching user agents:', error);
    res.status(500).json({ error: 'Failed to fetch user agents' });
  }
};

/**
 * Get user's deployments
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getDeployments = async (req, res) => {
  try {
    const { address } = req.query;
    
    if (!address) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }
    
    // Try to get deployments from iAgent
    try {
      // This would be a call to iAgent API to get deployments for a user
      // For now, we'll use mock data
      const deployments = [
        {
          id: 'deploy-1',
          agent_id: 'agent-1',
          agent_name: 'Market Monitor',
          status: 'running',
          deployed_at: '2023-05-16T09:20:00Z',
          resources: {
            cpu: '0.5',
            memory: '256Mi',
            storage: '1Gi'
          },
          metrics: {
            uptime: '26d 5h',
            requests_handled: 12450,
            alerts_sent: 32
          }
        },
        {
          id: 'deploy-3',
          agent_id: 'agent-3',
          agent_name: 'Portfolio Tracker',
          status: 'running',
          deployed_at: '2023-07-06T10:15:00Z',
          resources: {
            cpu: '0.3',
            memory: '128Mi',
            storage: '500Mi'
          },
          metrics: {
            uptime: '34d 12h',
            requests_handled: 8920,
            reports_generated: 15
          }
        }
      ];
      
      res.json(deployments);
    } catch (error) {
      console.error('Error fetching from iAgent:', error);
      
      // Fallback to mock data for development
      const deployments = [
        {
          id: 'deploy-1',
          agent_id: 'agent-1',
          agent_name: 'Market Monitor',
          status: 'running',
          deployed_at: '2023-05-16T09:20:00Z',
          resources: {
            cpu: '0.5',
            memory: '256Mi',
            storage: '1Gi'
          },
          metrics: {
            uptime: '26d 5h',
            requests_handled: 12450,
            alerts_sent: 32
          }
        },
        {
          id: 'deploy-3',
          agent_id: 'agent-3',
          agent_name: 'Portfolio Tracker',
          status: 'running',
          deployed_at: '2023-07-06T10:15:00Z',
          resources: {
            cpu: '0.3',
            memory: '128Mi',
            storage: '500Mi'
          },
          metrics: {
            uptime: '34d 12h',
            requests_handled: 8920,
            reports_generated: 15
          }
        }
      ];
      
      res.json(deployments);
    }
  } catch (error) {
    console.error('Error fetching user deployments:', error);
    res.status(500).json({ error: 'Failed to fetch user deployments' });
  }
};

/**
 * Get user's analytics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAnalytics = async (req, res) => {
  try {
    const { address } = req.query;
    
    if (!address) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }
    
    // Try to get analytics from the blockchain and iAgent
    try {
      // Get user's agents
      const allAgents = await injectiveService.getAllAgents();
      const userAgents = allAgents.filter(agent => agent.owner === address);
      
      // Get analytics for each agent
      const agentAnalytics = await Promise.all(
        userAgents.map(async (agent) => {
          try {
            return await injectiveService.getAgentAnalytics(agent.id);
          } catch (error) {
            console.error(`Error getting analytics for agent ${agent.id}:`, error);
            return null;
          }
        })
      );
      
      // Aggregate analytics
      const validAnalytics = agentAnalytics.filter(a => a !== null);
      
      // Calculate totals
      const analytics = {
        agents: {
          total: userAgents.length,
          active: userAgents.filter(a => a.status === 'active').length,
          inactive: userAgents.filter(a => a.status !== 'active').length
        },
        deployments: {
          total: validAnalytics.length,
          running: validAnalytics.filter(a => a.status === 'running').length,
          stopped: validAnalytics.filter(a => a.status !== 'running').length
        },
        usage: {
          requests_total: validAnalytics.reduce((sum, a) => sum + (a.requests || 0), 0),
          compute_hours: validAnalytics.reduce((sum, a) => sum + (a.compute_hours || 0), 0),
          storage_used: `${validAnalytics.reduce((sum, a) => sum + (a.storage_used || 0), 0)}Gi`
        },
        revenue: {
          total: validAnalytics.reduce((sum, a) => sum + (a.revenue?.total || 0), 0),
          this_month: validAnalytics.reduce((sum, a) => sum + (a.revenue?.this_month || 0), 0),
          last_month: validAnalytics.reduce((sum, a) => sum + (a.revenue?.last_month || 0), 0)
        },
        expenses: {
          total: validAnalytics.reduce((sum, a) => sum + (a.expenses?.total || 0), 0),
          this_month: validAnalytics.reduce((sum, a) => sum + (a.expenses?.this_month || 0), 0),
          last_month: validAnalytics.reduce((sum, a) => sum + (a.expenses?.last_month || 0), 0)
        },
        chart_data: {
          requests: [
            { date: '2023-07-10', value: 320 },
            { date: '2023-07-17', value: 480 },
            { date: '2023-07-24', value: 520 },
            { date: '2023-07-31', value: 410 },
            { date: '2023-08-07', value: 650 }
          ],
          revenue: [
            { date: '2023-07-10', value: 15 },
            { date: '2023-07-17', value: 22 },
            { date: '2023-07-24', value: 19 },
            { date: '2023-07-31', value: 25 },
            { date: '2023-08-07', value: 30 }
          ]
        }
      };
      
      return res.json(analytics);
    } catch (blockchainError) {
      console.error('Error fetching from blockchain:', blockchainError);
      
      // Fallback to mock data for development
      const analytics = {
        agents: {
          total: 3,
          active: 2,
          inactive: 1
        },
        deployments: {
          total: 2,
          running: 2,
          stopped: 0
        },
        usage: {
          requests_total: 21370,
          compute_hours: 1450,
          storage_used: '1.5Gi'
        },
        revenue: {
          total: 250,
          this_month: 75,
          last_month: 120
        },
        expenses: {
          total: 120,
          this_month: 35,
          last_month: 45
        },
        chart_data: {
          requests: [
            { date: '2023-07-10', value: 320 },
            { date: '2023-07-17', value: 480 },
            { date: '2023-07-24', value: 520 },
            { date: '2023-07-31', value: 410 },
            { date: '2023-08-07', value: 650 }
          ],
          revenue: [
            { date: '2023-07-10', value: 15 },
            { date: '2023-07-17', value: 22 },
            { date: '2023-07-24', value: 19 },
            { date: '2023-07-31', value: 25 },
            { date: '2023-08-07', value: 30 }
          ]
        }
      };
      
      res.json(analytics);
    }
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};

/**
 * Get user's transactions
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getTransactions = async (req, res) => {
  try {
    const { address } = req.query;
    
    if (!address) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }
    
    // In a real implementation, this would fetch from the blockchain
    // For now, we'll use mock data
    const transactions = [
      {
        id: 'tx-1',
        type: 'purchase',
        agent_id: 'agent-1',
        agent_name: 'Market Monitor',
        amount: 50,
        timestamp: '2023-05-15T10:30:00Z',
        transaction_hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        status: 'completed'
      },
      {
        id: 'tx-2',
        type: 'sale',
        agent_id: 'agent-4',
        agent_name: 'News Aggregator',
        amount: 35,
        timestamp: '2023-06-22T14:45:00Z',
        transaction_hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        status: 'completed'
      },
      {
        id: 'tx-3',
        type: 'deployment',
        agent_id: 'agent-1',
        agent_name: 'Market Monitor',
        amount: 5,
        timestamp: '2023-05-16T09:20:00Z',
        transaction_hash: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
        status: 'completed'
      },
      {
        id: 'tx-4',
        type: 'purchase',
        agent_id: 'agent-3',
        agent_name: 'Portfolio Tracker',
        amount: 75,
        timestamp: '2023-07-05T16:40:00Z',
        transaction_hash: '0xdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abc',
        status: 'completed'
      },
      {
        id: 'tx-5',
        type: 'deployment',
        agent_id: 'agent-3',
        agent_name: 'Portfolio Tracker',
        amount: 5,
        timestamp: '2023-07-06T10:15:00Z',
        transaction_hash: '0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234',
        status: 'completed'
      }
    ];
    
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
}; 