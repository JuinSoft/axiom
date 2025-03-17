import { Link } from 'react-router-dom';
import { FiLayers, FiCode, FiDatabase, FiUserPlus, FiUsers, FiShield, FiTrendingUp, FiAward, FiClock } from 'react-icons/fi';
import { IconType } from 'react-icons';
import market from '../assets/market.jpeg';
import trade from '../assets/trade.jpeg';
import onchain from '../assets/onchain.jpeg';

const HomePage = () => {
  // Get today's date in the format "Month Day, Year"
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  
  // Featured agents with today's date
  const featuredAgents = [
    {
      id: '1',
      name: 'Market Sentinel',
      description: 'Advanced market monitoring with customizable alerts and insights.',
      category: 'Finance',
      price: 50,
      creator: 'BlockchainLabs',
      rating: 4.8,
      createdDate: formattedDate,
      image: market
    },
    {
      id: '2',
      name: 'TradeMaster Pro',
      description: 'Automated trading with support for multiple strategies and risk management.',
      category: 'Trading',
      price: 120,
      creator: 'AlgoTraders',
      rating: 4.6,
      createdDate: formattedDate,
      image: trade
    },
    {
      id: '3',
      name: 'OnChain Analyzer',
      description: 'Deep analysis of blockchain data with visualization and pattern recognition.',
      category: 'Analytics',
      price: 75,
      creator: 'DataVision',
      rating: 4.9,
      createdDate: formattedDate,
      image: onchain
    }
  ];
  
  return (
    <div className="container mx-auto px-4 md:px-8 py-8">
      {/* Hero Section with Gradient Background */}
      <div 
        className="py-16 md:py-24 text-center rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 md:px-12 mb-16 relative overflow-hidden"
      >
        <div 
          className="absolute inset-0 opacity-10 bg-cover bg-center"
          style={{ backgroundImage: "url('https://via.placeholder.com/1000x600?text=Background')" }}
        ></div>
        
        <div className="relative z-10">
          <span 
            className="inline-block bg-white text-blue-600 text-sm font-bold px-3 py-1 rounded-full mb-6"
          >
            {formattedDate} • New Platform Launch
          </span>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-5 leading-tight">
            <span className="block">
              Create AI Agents
            </span>
            <span
              className="block text-white drop-shadow-lg"
            >
              Without Writing Code
            </span>
          </h1>
          
          <p
            className="text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto opacity-90 mb-10"
          >
            Design, deploy, and manage AI agents on the Injective blockchain using our intuitive no-code platform.
          </p>
          
          <div
            className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-0"
          >
            <div 
              className="sm:mr-4 mb-4 sm:mb-0"
            >
              <Link to="/design-studio" className="no-underline">
                <button
                  className="px-8 py-6 text-md font-bold bg-white text-blue-600 rounded-lg hover:transform hover:-translate-y-1 hover:shadow-lg hover:bg-gray-100 active:transform active:translate-y-0 active:bg-gray-200 transition-all duration-200"
                >
                  Get Started
                </button>
              </Link>
            </div>
            
            <div>
              <Link to="/marketplace" className="no-underline">
                <button
                  className="px-8 py-6 text-md font-bold bg-transparent text-white rounded-lg border border-white hover:transform hover:-translate-y-1 hover:shadow-lg hover:bg-white/10 active:transform active:translate-y-0 active:bg-white/20 transition-all duration-200"
                >
                  Explore Marketplace
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Agents Section */}
      <div className="py-12 mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2
            className="text-2xl md:text-3xl font-bold"
          >
            Featured Agents
          </h2>
          
          <Link to="/marketplace" className="no-underline">
            <button
              className="text-blue-500 font-medium hover:text-blue-700 flex items-center"
            >
              View All
              <FiTrendingUp className="ml-2" />
            </button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredAgents.map((agent) => (
            <div
              key={agent.id}
              className="rounded-lg overflow-hidden bg-white border border-gray-200 shadow-md hover:transform hover:-translate-y-1 hover:shadow-lg hover:border-blue-200 transition-all duration-300"
            >
              <img
                src={agent.image}
                alt={agent.name}
                className="w-full h-[150px] object-cover"
              />
              
              <div className="p-5">
                <div className="flex justify-between items-center mb-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    {agent.category}
                  </span>
                  <span className="font-bold text-blue-500">
                    {agent.price} INJ
                  </span>
                </div>
                
                <h3 className="text-md font-medium mb-2">
                  {agent.name.length > 20 ? `${agent.name.substring(0, 20)}...` : agent.name}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4">
                  {agent.description.length > 100 ? `${agent.description.substring(0, 100)}...` : agent.description}
                </p>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <FiAward className="text-yellow-400" />
                    <span className="text-sm text-gray-600 ml-1">
                      {agent.rating}/5.0
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <FiClock className="text-gray-500" />
                    <span className="text-sm text-gray-600 ml-1">
                      Added {formattedDate}
                    </span>
                  </div>
                </div>
                
                <Link to={`/marketplace/${agent.id}`} className="no-underline">
                  <button
                    className="mt-4 w-full py-2 border border-blue-500 text-blue-500 font-medium rounded-md hover:bg-blue-50 transition-colors"
                  >
                    View Details
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <h2
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          Key Features
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <FeatureCard 
            icon={FiLayers} 
            title="User-Friendly Interface" 
            description="Drag-and-drop tools and natural language input for describing agent behaviors." 
          />
          
          <FeatureCard 
            icon={FiCode} 
            title="AI-Assisted Design" 
            description="Generate agent configurations from user descriptions with AI assistance." 
          />
          
          <FeatureCard 
            icon={FiDatabase} 
            title="Blockchain Deployment" 
            description="Seamless integration with iAgent for deploying agents on the Injective blockchain." 
          />
          
          <FeatureCard 
            icon={FiShield} 
            title="Secure & Trustless" 
            description="Your agents run on decentralized infrastructure with robust security guarantees." 
          />
          
          <FeatureCard 
            icon={FiUserPlus} 
            title="Customizable Agents" 
            description="Tailor your agents to specific use cases with powerful customization options." 
          />
          
          <FeatureCard 
            icon={FiUsers} 
            title="Vibrant Marketplace" 
            description="Discover pre-built agents created by our community or monetize your own creations." 
          />
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gray-50 rounded-xl px-8 mb-16">
        <h2
          className="text-2xl md:text-3xl font-bold text-center mb-12"
        >
          Platform Statistics
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard number="1,250+" label="Active Agents" />
          <StatCard number="$2.5M+" label="Trading Volume" />
          <StatCard number="10,000+" label="Users" />
          <StatCard number="25+" label="Agent Categories" />
        </div>
      </div>

      {/* CTA Section */}
      <div 
        className="py-12 px-6 md:px-12 lg:px-16 rounded-xl bg-blue-600 text-white shadow-xl my-16"
      >
        <div 
          className="flex flex-col lg:flex-row justify-between items-center"
        >
          <div className="mb-8 lg:mb-0">
            <h2 className="text-2xl font-bold mb-4">
              Ready to get started?
            </h2>
            <p className="text-xl opacity-90 max-w-lg">
              Join our community of creators and innovators building the future of AI on blockchain.
            </p>
          </div>
          
          <div>
            <Link to="/design-studio" className="no-underline">
              <button
                className="bg-white text-blue-600 px-8 py-6 text-md font-bold rounded-lg hover:bg-gray-100 hover:transform hover:-translate-y-1 hover:shadow-lg active:bg-gray-200 active:transform active:translate-y-0 transition-all duration-200"
              >
                Start Building
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Feature Card Component
interface FeatureCardProps {
  icon: IconType;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  const Icon = icon;
  
  return (
    <div
      className="p-6 rounded-lg border border-gray-200 bg-white shadow-sm hover:transform hover:-translate-y-1 hover:shadow-md hover:border-blue-200 transition-all duration-300"
    >
      <div
        className="w-12 h-12 flex items-center justify-center rounded-md bg-blue-500 text-white mb-4"
      >
        <Icon className="w-6 h-6" />
      </div>
      
      <h3 className="text-md font-semibold mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600">
        {description}
      </p>
    </div>
  );
};

// Stat Card Component
interface StatCardProps {
  number: string;
  label: string;
}

const StatCard = ({ number, label }: StatCardProps) => {
  return (
    <div
      className="text-center p-6 rounded-lg bg-white shadow-sm"
    >
      <p
        className="text-3xl md:text-4xl font-bold text-blue-500 mb-2"
      >
        {number}
      </p>
      <p className="text-gray-600 text-lg">
        {label}
      </p>
    </div>
  );
};

export default HomePage; 