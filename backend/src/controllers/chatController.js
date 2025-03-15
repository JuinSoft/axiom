const InjectiveService = require('../services/injectiveService');
const injectiveService = new InjectiveService();

/**
 * Start a new chat session with an agent
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.startSession = async (req, res) => {
  try {
    const { agentId } = req.body;
    
    if (!agentId) {
      return res.status(400).json({ error: 'Agent ID is required' });
    }
    
    // Try to get agent from the blockchain
    try {
      const agent = await injectiveService.getAgentById(agentId);
      
      if (!agent) {
        return res.status(404).json({ error: 'Agent not found' });
      }
      
      // Generate a unique session ID
      const sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      // Return session info
      return res.json({
        sessionId,
        agentId,
        agentName: agent.name,
        agentDescription: agent.description,
        startTime: new Date().toISOString()
      });
    } catch (blockchainError) {
      console.error('Error fetching from blockchain:', blockchainError);
      
      // Fallback to mock data for development
      const sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      res.json({
        sessionId,
        agentId,
        agentName: 'Market Monitor',
        agentDescription: 'Monitors cryptocurrency markets and sends alerts based on price movements.',
        startTime: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error starting chat session:', error);
    res.status(500).json({ error: 'Failed to start chat session' });
  }
};

/**
 * Send a message to an agent
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.sendMessage = async (req, res) => {
  try {
    const { agentId, sessionId, message } = req.body;
    
    if (!agentId || !sessionId || !message) {
      return res.status(400).json({ error: 'Agent ID, session ID, and message are required' });
    }
    
    // Try to send message to the agent via iAgent
    try {
      const response = await injectiveService.chatWithAgent(agentId, message, sessionId);
      
      return res.json({
        id: `msg-${Date.now()}`,
        sessionId,
        agentId,
        message,
        response: response.text,
        timestamp: new Date().toISOString()
      });
    } catch (iAgentError) {
      console.error('Error sending message to iAgent:', iAgentError);
      
      // Fallback to mock data for development
      // Simulate different responses based on the message content
      let response;
      
      if (message.toLowerCase().includes('price') || message.toLowerCase().includes('market')) {
        response = "Based on current market data, BTC is trading at $65,432 with a 24h change of +2.3%. ETH is at $3,210 with a 24h change of +1.5%. The overall market sentiment is bullish with increasing volume across major exchanges.";
      } else if (message.toLowerCase().includes('trend') || message.toLowerCase().includes('analysis')) {
        response = "Technical analysis shows BTC is in an uptrend with strong support at $62,000. RSI is at 58, indicating room for further growth. The 50-day moving average has crossed above the 200-day moving average, forming a golden cross pattern which is typically bullish.";
      } else if (message.toLowerCase().includes('alert') || message.toLowerCase().includes('notify')) {
        response = "I've set up an alert for you. I'll notify you when BTC crosses the $70,000 threshold or if there's a sudden price movement of more than 5% in either direction.";
      } else {
        response = "I'm your Market Monitor agent. I can provide real-time market data, technical analysis, and set up price alerts for you. What specific information would you like to know about the cryptocurrency markets today?";
      }
      
      res.json({
        id: `msg-${Date.now()}`,
        sessionId,
        agentId,
        message,
        response,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

/**
 * Get chat history for a session
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }
    
    // In a real implementation, this would fetch from a database
    // For now, we'll use mock data
    const history = [
      {
        id: 'msg-1',
        sessionId,
        agentId: 'agent-1',
        message: 'Hello, can you give me an update on the market?',
        response: "Hello! Currently, BTC is trading at $65,432 with a 24h change of +2.3%. ETH is at $3,210 with a 24h change of +1.5%. The overall market sentiment is bullish with increasing volume across major exchanges.",
        timestamp: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
      },
      {
        id: 'msg-2',
        sessionId,
        agentId: 'agent-1',
        message: 'What\'s the technical analysis for Bitcoin?',
        response: "Technical analysis shows BTC is in an uptrend with strong support at $62,000. RSI is at 58, indicating room for further growth. The 50-day moving average has crossed above the 200-day moving average, forming a golden cross pattern which is typically bullish.",
        timestamp: new Date(Date.now() - 1800000).toISOString() // 30 minutes ago
      },
      {
        id: 'msg-3',
        sessionId,
        agentId: 'agent-1',
        message: 'Can you set an alert for when Bitcoin crosses $70,000?',
        response: "I've set up an alert for you. I'll notify you when BTC crosses the $70,000 threshold.",
        timestamp: new Date(Date.now() - 900000).toISOString() // 15 minutes ago
      }
    ];
    
    res.json(history);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
};

/**
 * End a chat session
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.endSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }
    
    // In a real implementation, this would update the session status in a database
    // For now, we'll just return a success message
    res.json({
      sessionId,
      status: 'ended',
      endTime: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error ending chat session:', error);
    res.status(500).json({ error: 'Failed to end chat session' });
  }
}; 