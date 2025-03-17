import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Marketplace: React.FC = () => {
  const [category, setCategory] = useState('all');
  
  // Mock data for marketplace agents
  const agents = [
    {
      id: '1',
      name: 'Market Sentinel',
      description: 'Advanced market monitoring with customizable alerts and insights.',
      category: 'finance',
      price: 50,
      creator: 'BlockchainLabs',
      rating: 4.8,
    },
    {
      id: '2',
      name: 'TradeMaster Pro',
      description: 'Automated trading with support for multiple strategies and risk management.',
      category: 'trading',
      price: 120,
      creator: 'AlgoTraders',
      rating: 4.6,
    },
    {
      id: '3',
      name: 'OnChain Analyzer',
      description: 'Deep analysis of blockchain data with visualization and pattern recognition.',
      category: 'analytics',
      price: 75,
      creator: 'DataVision',
      rating: 4.9,
    },
  ];
  
  const filteredAgents = category === 'all' 
    ? agents 
    : agents.filter(agent => agent.category === category);
  
  return (
    <div className="marketplace-container">
      <h1>Agent Marketplace</h1>
      <p>Discover and purchase AI agents created by the community.</p>
      
      <div className="category-filter">
        <button 
          className={category === 'all' ? 'active' : ''} 
          onClick={() => setCategory('all')}
        >
          All
        </button>
        <button 
          className={category === 'finance' ? 'active' : ''} 
          onClick={() => setCategory('finance')}
        >
          Finance
        </button>
        <button 
          className={category === 'trading' ? 'active' : ''} 
          onClick={() => setCategory('trading')}
        >
          Trading
        </button>
        <button 
          className={category === 'analytics' ? 'active' : ''} 
          onClick={() => setCategory('analytics')}
        >
          Analytics
        </button>
      </div>
      
      <div className="agent-grid">
        {filteredAgents.map(agent => (
          <div key={agent.id} className="agent-card">
            <h3>{agent.name}</h3>
            <p>{agent.description}</p>
            <div className="agent-meta">
              <span className="category">{agent.category}</span>
              <span className="price">{agent.price} INJ</span>
              <span className="rating">★ {agent.rating}</span>
            </div>
            <div className="agent-creator">By {agent.creator}</div>
            <Link to={`/marketplace/${agent.id}`} className="view-button">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace; 