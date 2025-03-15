import React, { useState, useEffect } from 'react';
import { useWalletStore } from '../store/walletStore';
import axios from 'axios';

const WalletConnect: React.FC = () => {
  const { isConnected, address, connect, disconnect } = useWalletStore();
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState<{ inj: number; usdt: number; usdc: number } | null>(null);

  useEffect(() => {
    if (isConnected && address) {
      fetchBalance();
    } else {
      setBalance(null);
    }
  }, [isConnected, address]);

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      
      // Check if Keplr is installed
      if (!window.keplr) {
        alert('Keplr wallet not found. Please install Keplr extension first.');
        return;
      }
      
      // Request connection to Keplr
      await window.keplr.enable('injective-1');
      
      // Get the offlineSigner for the chainId
      const offlineSigner = window.keplr.getOfflineSigner('injective-1');
      
      // Get accounts from the offline signer
      const accounts = await offlineSigner.getAccounts();
      
      if (accounts && accounts.length > 0) {
        const userAddress = accounts[0].address;
        
        // Notify backend about the connection
        await axios.post('/api/wallet/connect', { address: userAddress });
        
        // Update wallet store
        connect(userAddress);
        
        alert('Your Keplr wallet has been connected successfully.');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect to Keplr wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setIsLoading(true);
      
      // Notify backend about the disconnection
      await axios.post('/api/wallet/disconnect', { address });
      
      // Update wallet store
      disconnect();
      
      alert('Your wallet has been disconnected successfully.');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      alert('Failed to disconnect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBalance = async () => {
    try {
      const response = await axios.get(`/api/wallet/balance`, {
        params: { address }
      });
      
      setBalance(response.data.balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
      alert('Could not retrieve your wallet balance');
    }
  };

  return (
    <div className="wallet-connect">
      {isConnected ? (
        <div className="wallet-info">
          <div className="wallet-address">
            <strong>Connected:</strong>
            <span>{`${address?.substring(0, 8)}...${address?.substring(address.length - 6)}`}</span>
          </div>
          
          {balance && (
            <div className="wallet-balance">
              <strong>Balance:</strong>
              <div>{`${balance.inj.toFixed(4)} INJ`}</div>
              {balance.usdt > 0 && <div>{`${balance.usdt.toFixed(2)} USDT`}</div>}
              {balance.usdc > 0 && <div>{`${balance.usdc.toFixed(2)} USDC`}</div>}
            </div>
          )}
          
          <button 
            className="disconnect-button"
            onClick={handleDisconnect} 
            disabled={isLoading}
          >
            {isLoading ? 'Disconnecting...' : 'Disconnect'}
          </button>
        </div>
      ) : (
        <button 
          className="connect-button"
          onClick={handleConnect} 
          disabled={isLoading}
        >
          {isLoading ? 'Connecting...' : 'Connect Keplr Wallet'}
        </button>
      )}
    </div>
  );
};

export default WalletConnect; 