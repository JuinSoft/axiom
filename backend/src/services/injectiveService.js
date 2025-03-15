const { 
  ChainGrpcWasmApi, 
  MsgExecuteContractCompat,
  PrivateKey,
  Wallet,
  MsgBroadcasterWithPk
} = require('@injectivelabs/sdk-ts');
const { createTransaction, TxGrpcClient, TxClient } = require('@injectivelabs/sdk-ts/dist/core/transaction');
const { Network, getNetworkEndpoints } = require('@injectivelabs/networks');
const { BigNumberInBase, DEFAULT_STD_FEE } = require('@injectivelabs/utils');
const axios = require('axios');

class InjectiveService {
  constructor() {
    this.network = process.env.INJECTIVE_NETWORK === 'mainnet' 
      ? Network.MainnetK8s 
      : Network.TestnetK8s;
    this.endpoints = getNetworkEndpoints(this.network);
    this.chainGrpcWasmApi = new ChainGrpcWasmApi(this.endpoints.grpc);
    this.txClient = new TxGrpcClient(this.endpoints.grpc);
    
    // Initialize iAgent API client
    this.iAgentApiUrl = process.env.IAGENT_API_URL || 'http://localhost:5000';
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
   * Register an agent in the registry
   * @param {string} mnemonic - The mnemonic phrase
   * @param {string} name - Agent name
   * @param {string} description - Agent description
   * @param {string} configuration - Agent configuration
   * @returns {Promise<any>} Transaction result
   */
  async registerAgent(mnemonic, name, description, configuration) {
    const contractAddress = process.env.AGENT_REGISTRY_CONTRACT_ADDRESS;
    
    const msg = {
      register_agent: {
        name,
        description,
        configuration
      }
    };
    
    return this.executeContract(mnemonic, contractAddress, msg);
  }

  /**
   * List an agent in the marketplace
   * @param {string} mnemonic - The mnemonic phrase
   * @param {string} name - Agent name
   * @param {string} description - Agent description
   * @param {string} price - Agent price in INJ
   * @param {string} category - Agent category
   * @returns {Promise<any>} Transaction result
   */
  async listAgentInMarketplace(mnemonic, name, description, price, category) {
    const contractAddress = process.env.MARKETPLACE_CONTRACT_ADDRESS;
    
    const msg = {
      list_agent: {
        name,
        description,
        price: {
          denom: 'inj',
          amount: price
        },
        category
      }
    };
    
    return this.executeContract(mnemonic, contractAddress, msg);
  }

  /**
   * Purchase an agent from the marketplace
   * @param {string} mnemonic - The mnemonic phrase
   * @param {string} agentId - Agent ID
   * @param {string} price - Agent price in INJ
   * @returns {Promise<any>} Transaction result
   */
  async purchaseAgent(mnemonic, agentId, price) {
    const contractAddress = process.env.MARKETPLACE_CONTRACT_ADDRESS;
    
    const msg = {
      purchase_agent: {
        agent_id: agentId
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
    
    return this.executeContract(mnemonic, contractAddress, msg, options);
  }

  /**
   * Deploy an agent to iAgent
   * @param {string} agentId - The agent ID from the registry
   * @param {object} configuration - The agent configuration
   * @returns {Promise<any>} Deployment result
   */
  async deployAgentToIAgent(agentId, configuration) {
    try {
      // Parse the configuration
      const parsedConfig = JSON.parse(configuration);
      
      // Since iAgent doesn't have a /agents endpoint, we'll use the /chat endpoint
      // to initialize the agent with a special command
      const response = await axios.post(`${this.iAgentApiUrl}/chat`, {
        agent_id: `axiom-${agentId}`,
        agent_key: parsedConfig.privateKey,
        environment: this.network === Network.MainnetK8s ? 'mainnet' : 'testnet',
        message: `Initialize agent with name: ${parsedConfig.name}, description: ${parsedConfig.description}`
      });
      
      return {
        success: true,
        agent_id: `axiom-${agentId}`,
        name: parsedConfig.name,
        description: parsedConfig.description,
        response: response.data
      };
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
      // Since iAgent doesn't have a /agents/{agent_id} endpoint, we'll use the /history endpoint
      // to get information about the agent's conversations
      const response = await axios.get(`${this.iAgentApiUrl}/history`, {
        params: { session_id: `axiom-${agentId}` }
      });
      
      return {
        agent_id: `axiom-${agentId}`,
        history: response.data.history || []
      };
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
      // Since iAgent doesn't have a /agents/{agent_id} endpoint for deletion,
      // we'll use the /clear endpoint to clear the agent's conversation history
      const response = await axios.post(`${this.iAgentApiUrl}/clear`, null, {
        params: { session_id: `axiom-${agentId}` }
      });
      
      return {
        success: true,
        message: 'Agent conversation history cleared',
        response: response.data
      };
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
        agent_id: `axiom-${agentId}`,
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
}

module.exports = new InjectiveService(); 