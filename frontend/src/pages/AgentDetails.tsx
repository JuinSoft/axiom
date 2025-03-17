import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useWalletStore } from '../store/walletStore';

const AgentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isConnected } = useWalletStore();
  const [agent, setAgent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call to fetch agent details
    setTimeout(() => {
      setAgent({
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
      });
      setLoading(false);
    }, 1000);
  }, [id]);
  
  const handlePurchase = () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }
    
    alert(`Purchase initiated for agent: ${agent.name}`);
    // In a real app, this would call the backend to process the purchase
  };
  
  if (loading) {
    return <div>Loading agent details...</div>;
  }
  
  if (!agent) {
    return <div>Agent not found</div>;
  }
  
  return (
    <div className="agent-details-container">
      <h1>{agent.name}</h1>
      <div className="agent-meta">
        <span className="category">{agent.category}</span>
        <span className="rating">★ {agent.rating}</span>
        <span className="downloads">{agent.downloads} downloads</span>
      </div>
      
      <div className="agent-creator">
        Created by {agent.creator}
      </div>
      
      <div className="agent-description">
        <h2>Description</h2>
        <p>{agent.description}</p>
      </div>
      
      <div className="agent-capabilities">
        <h2>Capabilities</h2>
        <ul>
          {agent.capabilities.map((capability: string, index: number) => (
            <li key={index}>{capability}</li>
          ))}
        </ul>
      </div>
      
      <div className="agent-reviews">
        <h2>Reviews</h2>
        {agent.reviews.map((review: any, index: number) => (
          <div key={index} className="review">
            <div className="review-header">
              <span className="review-user">{review.user}</span>
              <span className="review-rating">★ {review.rating}</span>
              <span className="review-date">{new Date(review.date).toLocaleDateString()}</span>
            </div>
            <p className="review-comment">{review.comment}</p>
          </div>
        ))}
      </div>
      
      <div className="agent-purchase">
        <div className="price">{agent.price} INJ</div>
        <button 
          className="purchase-button"
          onClick={handlePurchase}
          disabled={!isConnected}
        >
          {isConnected ? 'Purchase Agent' : 'Connect Wallet to Purchase'}
        </button>
      </div>
    </div>
  );
};

export default AgentDetails; 