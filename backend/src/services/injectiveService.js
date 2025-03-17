const { 
  ChainGrpcWasmApi, 
  MsgExecuteContractCompat,
  PrivateKey,
  Wallet,
  MsgBroadcasterWithPk,
  ChainGrpcBankApi,
  ChainGrpcAuthApi,
  ChainGrpcTxApi
} = require('@injectivelabs/sdk-ts');
const { Network, getNetworkEndpoints } = require('@injectivelabs/networks');
const { BigNumberInBase, DEFAULT_STD_FEE, BigNumberInWei } = require('@injectivelabs/utils');
const axios = require('axios');

// Contract addresses
const AGENT_REGISTRY_CONTRACT = process.env.AGENT_REGISTRY_CONTRACT_ADDRESS || 'inj1ady3s7whj340xc7l3xj8zl4gzyveupn4z7yy8f'; // Replace with actual contract address
const MARKETPLACE_CONTRACT = process.env.MARKETPLACE_CONTRACT_ADDRESS || 'inj1f6lmn9hcknfv2wkzh8xd5ws4wkk02npyxpnsmr'; // Replace with actual contract address

class InjectiveService {
  constructor() {
    this.network = process.env.INJECTIVE_NETWORK === 'mainnet' 
      ? Network.MainnetK8s 
      : Network.TestnetK8s;
    this.endpoints = getNetworkEndpoints(this.network);
    this.chainGrpcWasmApi = new ChainGrpcWasmApi(this.endpoints.grpc);
    
    // Initialize iAgent API client
    this.iAgentApiUrl = process.env.IAGENT_API_URL || 'https://iagent.injective.network/api';
    
    // Initialize bank API client for balance queries
    this.bankClient = new ChainGrpcBankApi(this.endpoints.grpc);
    
    // Initialize auth API client for account queries
    this.authClient = new ChainGrpcAuthApi(this.endpoints.grpc);
  }

  /**
   * Get the chain ID for the current network
   * @returns {string} Chain ID
   */
  getChainId() {
    return this.network === Network.MainnetK8s ? 'injective-1' : 'injective-888';
  }

  /**
   * Create a wallet from a mnemonic
   * @param {string} mnemonic - The mnemonic phrase
   * @returns {object} Wallet information
   */
  createWalletFromMnemonic(mnemonic) {
    try {
      const privateKey = PrivateKey.fromMnemonic(mnemonic);
      const injectiveAddress = privateKey.toBech32();
      
      return {
        address: injectiveAddress,
        privateKey
      };
    } catch (error) {
      console.error('Error creating wallet:', error);
      throw new Error('Failed to create wallet from mnemonic');
    }
  }

  /**
   * Query a smart contract
   * @param {string} contractAddress - The contract address
   * @param {object} query - The query object
   * @returns {Promise<any>} Query result
   */
  async queryContract(contractAddress, query) {
    try {
      const response = await this.chainGrpcWasmApi.fetchSmartContractState(
        contractAddress,
        Buffer.from(JSON.stringify(query)).toString('base64')
      );
      
      return JSON.parse(Buffer.from(response.data).toString());
    } catch (error) {
      console.error('Error querying contract:', error);
      throw new Error(`Failed to query contract: ${error.message}`);
    }
  }

  /**
   * Execute a smart contract
   * @param {string} mnemonic - The mnemonic phrase
   * @param {string} contractAddress - The contract address
   * @param {object} msg - The message to execute
   * @param {object} options - Additional options
   * @returns {Promise<any>} Transaction result
   */
  async executeContract(mnemonic, contractAddress, msg, options = {}) {
    try {
      const wallet = this.createWalletFromMnemonic(mnemonic);
      
      // Create the message
      const executeMsg = MsgExecuteContractCompat.fromJSON({
        sender: wallet.address,
        contractAddress,
        msg,
        funds: options.funds || []
      });
      
      // Use MsgBroadcasterWithPk for simplicity
      const txHash = await new MsgBroadcasterWithPk({
        privateKey: wallet.privateKey.toHex(),
        network: this.network
      }).broadcast({
        msgs: executeMsg,
        memo: options.memo || '',
        fee: options.fee || DEFAULT_STD_FEE
      });
      
      return {
        txHash,
        success: true
      };
    } catch (error) {
      console.error('Error executing contract:', error);
      throw new Error(`Failed to execute contract: ${error.message}`);
    }
  }

  /**
   * Get all agents from the registry
   * @returns {Promise<any>} List of agents
   */
  async getAllAgents() {
    try {
      const query = {
        get_all_agents: {}
      };
      
      return await this.queryContract(AGENT_REGISTRY_CONTRACT, query);
    } catch (error) {
      console.error('Error getting all agents:', error);
      throw new Error(`Failed to get all agents: ${error.message}`);
    }
  }

  /**
   * Get an agent by ID
   * @param {string} agentId - The agent ID
   * @returns {Promise<any>} Agent details
   */
  async getAgentById(agentId) {
    try {
      const query = {
        get_agent: {
          agent_id: agentId
        }
      };
      
      return await this.queryContract(AGENT_REGISTRY_CONTRACT, query);
    } catch (error) {
      console.error('Error getting agent by ID:', error);
      throw new Error(`Failed to get agent by ID: ${error.message}`);
    }
  }

  /**
   * Register an agent in the registry
   * @param {string} mnemonic - The mnemonic phrase
   * @param {string} name - Agent name
   * @param {string} description - Agent description
   * @param {string} configuration - Agent configuration
   * @returns {Promise<any>} Transaction result
   */
  async registerAgent(mnemonic, name, description, configuration) {
    const msg = {
      register_agent: {
        name,
        description,
        configuration
      }
    };
    
    return this.executeContract(mnemonic, AGENT_REGISTRY_CONTRACT, msg);
  }

  /**
   * Get all marketplace listings
   * @returns {Promise<any>} List of marketplace listings
   */
  async getMarketplaceListings() {
    try {
      const query = {
        get_all_listings: {}
      };
      
      return await this.queryContract(MARKETPLACE_CONTRACT, query);
    } catch (error) {
      console.error('Error getting marketplace listings:', error);
      throw new Error(`Failed to get marketplace listings: ${error.message}`);
    }
  }

  /**
   * Get marketplace listing by ID
   * @param {string} listingId - The listing ID
   * @returns {Promise<any>} Listing details
   */
  async getMarketplaceListingById(listingId) {
    try {
      const query = {
        get_listing: {
          listing_id: listingId
        }
      };
      
      return await this.queryContract(MARKETPLACE_CONTRACT, query);
    } catch (error) {
      console.error('Error getting marketplace listing by ID:', error);
      throw new Error(`Failed to get marketplace listing by ID: ${error.message}`);
    }
  }

  /**
   * List an agent in the marketplace
   * @param {string} mnemonic - The mnemonic phrase
   * @param {string} agentId - Agent ID
   * @param {string} price - Agent price in INJ
   * @param {string} category - Agent category
   * @returns {Promise<any>} Transaction result
   */
  async listAgentInMarketplace(mnemonic, agentId, price, category) {
    const msg = {
      list_agent: {
        agent_id: agentId,
        price: {
          denom: 'inj',
          amount: price
        },
        category
      }
    };
    
    return this.executeContract(mnemonic, MARKETPLACE_CONTRACT, msg);
  }

  /**
   * Purchase an agent from the marketplace
   * @param {string} mnemonic - The mnemonic phrase
   * @param {string} listingId - Listing ID
   * @param {string} price - Agent price in INJ
   * @returns {Promise<any>} Transaction result
   */
  async purchaseAgent(mnemonic, listingId, price) {
    const msg = {
      purchase_agent: {
        listing_id: listingId
      }
    };
    
    const options = {
      funds: [
        {
          denom: 'inj',
          amount: price
        }
      ]
    };
    
    return this.executeContract(mnemonic, MARKETPLACE_CONTRACT, msg, options);
  }

  /**
   * Deploy an agent to iAgent
   * @param {string} agentId - The agent ID from the registry
   * @param {object} configuration - The agent configuration
   * @returns {Promise<any>} Deployment result
   */
  async deployAgentToIAgent(agentId, configuration) {
    try {
      // Parse the configuration if it's a string
      const parsedConfig = typeof configuration === 'string' 
        ? JSON.parse(configuration) 
        : configuration;
      
      // Deploy to iAgent
      const response = await axios.post(`${this.iAgentApiUrl}/agents/deploy`, {
        agent_id: agentId,
        name: parsedConfig.name,
        description: parsedConfig.description,
        capabilities: parsedConfig.capabilities || [],
        parameters: parsedConfig.parameters || {}
      });
      
      return response.data;
    } catch (error) {
      console.error('Error deploying agent to iAgent:', error);
      throw new Error(`Failed to deploy agent to iAgent: ${error.message}`);
    }
  }

  /**
   * Get an agent from iAgent
   * @param {string} agentId - The agent ID
   * @returns {Promise<any>} Agent details
   */
  async getAgentFromIAgent(agentId) {
    try {
      const response = await axios.get(`${this.iAgentApiUrl}/agents/${agentId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting agent from iAgent:', error);
      throw new Error(`Failed to get agent from iAgent: ${error.message}`);
    }
  }

  /**
   * Delete an agent from iAgent
   * @param {string} agentId - The agent ID
   * @returns {Promise<any>} Deletion result
   */
  async deleteAgentFromIAgent(agentId) {
    try {
      const response = await axios.delete(`${this.iAgentApiUrl}/agents/${agentId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting agent from iAgent:', error);
      throw new Error(`Failed to delete agent from iAgent: ${error.message}`);
    }
  }

  /**
   * Chat with an agent on iAgent
   * @param {string} agentId - The agent ID
   * @param {string} message - The user message
   * @param {string} sessionId - Optional session ID for continuing conversations
   * @returns {Promise<any>} Chat response
   */
  async chatWithAgent(agentId, message, sessionId = null) {
    try {
      const payload = {
        agent_id: agentId,
        message
      };
      
      if (sessionId) {
        payload.session_id = sessionId;
      }
      
      const response = await axios.post(`${this.iAgentApiUrl}/chat`, payload);
      return response.data;
    } catch (error) {
      console.error('Error chatting with agent:', error);
      throw new Error(`Failed to chat with agent: ${error.message}`);
    }
  }

  /**
   * Get agent analytics
   * @param {string} agentId - The agent ID
   * @returns {Promise<any>} Analytics data
   */
  async getAgentAnalytics(agentId) {
    try {
      const response = await axios.get(`${this.iAgentApiUrl}/agents/${agentId}/analytics`);
      return response.data;
    } catch (error) {
      console.error('Error getting agent analytics:', error);
      throw new Error(`Failed to get agent analytics: ${error.message}`);
    }
  }

  /**
   * Get wallet balance
   * @param {string} address - Wallet address
   * @returns {Promise<Object>} - Wallet balance
   */
  async getBalance(address) {
    try {
      // Get all balances for the address
      const balanceResponse = await this.bankClient.fetchBalances(address);
      
      // Extract and format the balances
      let inj = 0;
      let usdt = 0;
      let usdc = 0;
      
      if (balanceResponse && balanceResponse.balances) {
        for (const balance of balanceResponse.balances) {
          if (balance.denom === 'inj') {
            // Convert from wei (10^18) to INJ
            inj = new BigNumberInWei(balance.amount).toBase().toNumber();
          } else if (balance.denom.includes('peggy') && balance.denom.toLowerCase().includes('usdt')) {
            // Convert from smallest unit (10^6) to USDT
            usdt = new BigNumberInBase(balance.amount).div(1e6).toNumber();
          } else if (balance.denom.includes('peggy') && balance.denom.toLowerCase().includes('usdc')) {
            // Convert from smallest unit (10^6) to USDC
            usdc = new BigNumberInBase(balance.amount).div(1e6).toNumber();
          }
        }
      }
      
      return { inj, usdt, usdc };
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      throw error;
    }
  }
}

module.exports = InjectiveService; 