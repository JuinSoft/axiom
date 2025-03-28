import { useState, useEffect } from 'react';
import { marketplaceApi } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import WalletConnect from '../components/WalletConnect';
import { useWalletStore } from '../store/walletStore';

interface Agent {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  creator: string;
  rating: number;
  downloads: number;
  createdAt?: string;
  image?: string;
}

const MarketplacePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const navigate = useNavigate();
  const { address: walletAddress, isConnected } = useWalletStore();

  // Get today's date in the format "Month Day, Year"
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'finance', name: 'Finance' },
    { id: 'analytics', name: 'Analytics' },
    { id: 'trading', name: 'Trading' },
    { id: 'social', name: 'Social' },
    { id: 'utility', name: 'Utility' },
  ];

  useEffect(() => {
    fetchAgents();
  }, [selectedCategory]);

  const fetchAgents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const filters = selectedCategory !== 'all' ? { category: selectedCategory } : undefined;
      const data = await marketplaceApi.getAgents(filters);
      setAgents(data);
    } catch (error) {
      console.error('Error fetching agents:', error);
      setError('Failed to load marketplace agents');
      
      // Fallback to dummy data for demo purposes with today's date
      setAgents([
        {
          id: '1',
          name: 'Market Sentinel',
          description: 'Advanced market monitoring with customizable alerts and insights.',
          category: 'finance',
          price: 50,
          creator: 'BlockchainLabs',
          rating: 4.8,
          downloads: 1250,
          createdAt: formattedDate,
          image: 'https://via.placeholder.com/300x200?text=Market+Sentinel'
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
          createdAt: formattedDate,
          image: 'https://via.placeholder.com/300x200?text=TradeMaster'
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
          createdAt: formattedDate,
          image: 'https://via.placeholder.com/300x200?text=OnChain+Analyzer'
        },
        {
          id: '4',
          name: 'Social Pulse',
          description: 'Monitor social media sentiment and trends related to crypto assets.',
          category: 'social',
          price: 45,
          creator: 'SocialMetrics',
          rating: 4.5,
          downloads: 780,
          createdAt: formattedDate,
          image: 'https://via.placeholder.com/300x200?text=Social+Pulse'
        },
        {
          id: '5',
          name: 'Portfolio Manager',
          description: 'Automated portfolio balancing and optimization for maximum returns.',
          category: 'finance',
          price: 95,
          creator: 'FinanceAI',
          rating: 4.7,
          downloads: 1560,
          createdAt: formattedDate,
          image: 'https://via.placeholder.com/300x200?text=Portfolio+Manager'
        },
        {
          id: '6',
          name: 'Smart Contract Auditor',
          description: 'Automated security analysis and vulnerability detection for smart contracts.',
          category: 'utility',
          price: 150,
          creator: 'SecureChain',
          rating: 4.9,
          downloads: 650,
          createdAt: formattedDate,
          image: 'https://via.placeholder.com/300x200?text=Smart+Contract+Auditor'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = async (agentId: string) => {
    if (!walletAddress) {
      toast.warning('Please connect your wallet first');
      return;
    }

    try {
      setIsPurchasing(true);
      await marketplaceApi.purchaseAgent(agentId);
      toast.success('Agent purchased successfully');
      navigate(`/dashboard`);
    } catch (error) {
      console.error('Error purchasing agent:', error);
      toast.error('Failed to purchase agent');
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleViewDetails = (agentId: string) => {
    navigate(`/marketplace/${agentId}`);
  };

  const handleListAgent = () => {
    if (!walletAddress) {
      toast.warning('Please connect your wallet first');
      return;
    }
    navigate('/design-studio');
  };

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || agent.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Agent Marketplace
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Discover and purchase AI agents created by the community. Updated {formattedDate}.
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 items-center space-x-4">
          <WalletConnect />
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={handleListAgent}
            disabled={!walletAddress}
          >
            List Your Agent
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex-1">
          <label htmlFor="search" className="sr-only">Search</label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              name="search"
              id="search"
              className="input pl-10"
              placeholder="Search agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label htmlFor="category" className="sr-only">Category</label>
          <select
            id="category"
            name="category"
            className="input"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Agent Grid */}
      {isLoading ? (
        <div className="mt-8 text-center py-12">
          <p>Loading agents...</p>
        </div>
      ) : error ? (
        <div className="mt-8 text-center py-12 bg-red-50 rounded-lg">
          <p className="text-red-600">{error}</p>
          <button 
            className="mt-4 btn btn-outline"
            onClick={fetchAgents}
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAgents.map((agent) => (
            <div key={agent.id} className="card hover:shadow-lg transition-shadow">
              {agent.image && (
                <div className="w-full h-40 bg-gray-200 rounded-t-lg overflow-hidden">
                  <img 
                    src={agent.image} 
                    alt={agent.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-5">
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium text-gray-900">{agent.name}</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {categories.find(c => c.id === agent.category)?.name || agent.category}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-500">{agent.description}</p>
                
                <div className="mt-4 flex items-center">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-5 w-5 ${i < Math.floor(agent.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-1 text-sm text-gray-500">{agent.rating}</span>
                  </div>
                  <span className="ml-4 text-sm text-gray-500">{agent.downloads} downloads</span>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-lg font-medium text-gray-900">{agent.price} INJ</div>
                  <div className="text-sm text-gray-500">By {agent.creator}</div>
                </div>
                
                {agent.createdAt && (
                  <div className="mt-2 text-xs text-gray-500">
                    Added on {agent.createdAt}
                  </div>
                )}
                
                <div className="mt-4 flex space-x-2">
                  <button 
                    type="button" 
                    className="btn btn-primary flex-1"
                    onClick={() => handlePurchase(agent.id)}
                    disabled={!walletAddress || isPurchasing}
                  >
                    {isPurchasing ? 'Processing...' : 'Purchase'}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline flex-1"
                    onClick={() => handleViewDetails(agent.id)}
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {filteredAgents.length === 0 && !isLoading && !error && (
        <div className="mt-8 text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No agents found matching your criteria.</p>
          <button 
            className="mt-4 btn btn-outline"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default MarketplacePage; 