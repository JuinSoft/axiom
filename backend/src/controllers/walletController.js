const InjectiveService = require('../services/injectiveService');
const injectiveService = new InjectiveService();

/**
 * Connect a wallet
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.connect = async (req, res) => {
  try {
    const { address } = req.body;
    
    if (!address) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }
    
    // In a real implementation, this would validate the address and store it
    // For demo purposes, we'll just return a success response
    res.json({
      address,
      connected: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error connecting wallet:', error);
    res.status(500).json({ error: 'Failed to connect wallet' });
  }
};

/**
 * Get wallet balance
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getBalance = async (req, res) => {
  try {
    const { address } = req.query;
    
    if (!address) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }
    
    // Try to get balance from the blockchain
    try {
      const balance = await injectiveService.getBalance(address);
      
      return res.json({
        address,
        balance: {
          inj: balance.inj,
          usdt: balance.usdt || 0,
          usdc: balance.usdc || 0
        }
      });
    } catch (blockchainError) {
      console.error('Error fetching from blockchain:', blockchainError);
      
      // Fallback to mock data for development
      res.json({
        address,
        balance: {
          inj: 125.75,
          usdt: 500.25,
          usdc: 750.50
        }
      });
    }
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    res.status(500).json({ error: 'Failed to fetch wallet balance' });
  }
};

/**
 * Get transaction history
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getTransactions = async (req, res) => {
  try {
    const { address } = req.query;
    
    if (!address) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }
    
    // Try to get transactions from the blockchain
    try {
      const transactions = await injectiveService.getTransactions(address);
      
      // Format the transactions
      const formattedTransactions = transactions.map(tx => ({
        hash: tx.hash,
        type: tx.type,
        amount: tx.amount,
        fee: tx.fee,
        status: tx.status,
        timestamp: tx.timestamp,
        from: tx.from,
        to: tx.to
      }));
      
      return res.json(formattedTransactions);
    } catch (blockchainError) {
      console.error('Error fetching from blockchain:', blockchainError);
      
      // Fallback to mock data for development
      const transactions = [
        {
          hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
          type: 'send',
          amount: 10.5,
          fee: 0.002,
          status: 'completed',
          timestamp: '2023-08-01T10:30:00Z',
          from: address,
          to: 'inj1xyxyxyxyxyxyxyxyxyxyxyxyxyxyxyxyxyxy'
        },
        {
          hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
          type: 'receive',
          amount: 25.75,
          fee: 0.002,
          status: 'completed',
          timestamp: '2023-08-02T14:45:00Z',
          from: 'inj1ababababababababababababababababababab',
          to: address
        },
        {
          hash: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
          type: 'contract',
          amount: 5.25,
          fee: 0.003,
          status: 'completed',
          timestamp: '2023-08-03T09:20:00Z',
          from: address,
          to: 'inj1cdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcd'
        }
      ];
      
      res.json(transactions);
    }
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    res.status(500).json({ error: 'Failed to fetch transaction history' });
  }
};

/**
 * Connect wallet
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.connectWallet = async (req, res) => {
  try {
    // This is mostly handled on the frontend with Keplr
    // The backend just acknowledges the connection
    res.json({
      status: 'success',
      message: 'Wallet connection request acknowledged'
    });
  } catch (error) {
    console.error('Error connecting wallet:', error);
    res.status(500).json({ error: 'Failed to connect wallet' });
  }
};

/**
 * Disconnect wallet
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.disconnectWallet = async (req, res) => {
  try {
    // This is mostly handled on the frontend
    // The backend just acknowledges the disconnection
    res.json({
      status: 'success',
      message: 'Wallet disconnection request acknowledged'
    });
  } catch (error) {
    console.error('Error disconnecting wallet:', error);
    res.status(500).json({ error: 'Failed to disconnect wallet' });
  }
};

/**
 * Sign a message
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.signMessage = async (req, res) => {
  try {
    const { address, message } = req.body;
    
    if (!address || !message) {
      return res.status(400).json({ error: 'Wallet address and message are required' });
    }
    
    // In a real implementation, this would be handled by the wallet
    // For demo purposes, we'll return a mock signature
    const signature = {
      address,
      message,
      signature: `0x${Math.random().toString(16).substring(2, 66)}`,
      timestamp: new Date().toISOString()
    };
    
    res.json(signature);
  } catch (error) {
    console.error('Error signing message:', error);
    res.status(500).json({ error: 'Failed to sign message' });
  }
};

/**
 * Get wallet balance by address parameter
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getBalanceByAddress = async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!address) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }
    
    // Try to get balance from the blockchain
    try {
      const balance = await injectiveService.getBalance(address);
      
      return res.json({
        address,
        inj: balance.inj,
        usdt: balance.usdt || 0,
        usdc: balance.usdc || 0
      });
    } catch (blockchainError) {
      console.error('Error fetching from blockchain:', blockchainError);
      
      // Fallback to mock data for development
      res.json({
        address,
        inj: 125.75,
        usdt: 500.25,
        usdc: 750.50
      });
    }
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    res.status(500).json({ error: 'Failed to fetch wallet balance' });
  }
}; 