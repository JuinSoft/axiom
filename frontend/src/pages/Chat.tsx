import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
}

const Chat: React.FC = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [agentInfo, setAgentInfo] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Simulate fetching agent info
    setTimeout(() => {
      setAgentInfo({
        id: agentId,
        name: 'Market Monitor',
        description: 'Monitors cryptocurrency markets and sends alerts based on price movements.'
      });
      
      // Add welcome message
      setMessages([
        {
          id: 'welcome',
          sender: 'agent',
          text: "Hello! I'm your Market Monitor agent. I can provide real-time market data, technical analysis, and set up price alerts for you. What would you like to know about the cryptocurrency markets today?",
          timestamp: new Date().toISOString()
        }
      ]);
    }, 1000);
  }, [agentId]);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: input,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    // Simulate agent response
    setTimeout(() => {
      let response = '';
      
      if (input.toLowerCase().includes('price') || input.toLowerCase().includes('market')) {
        response = "Based on current market data, BTC is trading at $65,432 with a 24h change of +2.3%. ETH is at $3,210 with a 24h change of +1.5%. The overall market sentiment is bullish with increasing volume across major exchanges.";
      } else if (input.toLowerCase().includes('trend') || input.toLowerCase().includes('analysis')) {
        response = "Technical analysis shows BTC is in an uptrend with strong support at $62,000. RSI is at 58, indicating room for further growth. The 50-day moving average has crossed above the 200-day moving average, forming a golden cross pattern which is typically bullish.";
      } else if (input.toLowerCase().includes('alert') || input.toLowerCase().includes('notify')) {
        response = "I've set up an alert for you. I'll notify you when BTC crosses the $70,000 threshold or if there's a sudden price movement of more than 5% in either direction.";
      } else {
        response = "I'm not sure I understand. Could you please clarify what specific information you're looking for about the cryptocurrency markets?";
      }
      
      const agentMessage: Message = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: response,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, agentMessage]);
      setLoading(false);
    }, 1500);
  };
  
  if (!agentInfo) {
    return <div>Loading agent information...</div>;
  }
  
  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>Chat with {agentInfo.name}</h1>
        <p>{agentInfo.description}</p>
      </div>
      
      <div className="messages-container">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`message ${message.sender === 'user' ? 'user-message' : 'agent-message'}`}
          >
            <div className="message-content">
              {message.text}
            </div>
            <div className="message-timestamp">
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="message agent-message">
            <div className="message-content typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="message-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat; 