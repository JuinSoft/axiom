import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WalletContextType {
  walletAddress: string | null;
  isConnecting: boolean;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Check if wallet was previously connected
    const savedAddress = localStorage.getItem('walletAddress');
    if (savedAddress) {
      setWalletAddress(savedAddress);
    }
  }, []);

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      
      // Check if Keplr is installed
      if (!window.keplr) {
        alert("Please install Keplr extension");
        return;
      }

      // Request connection to Injective chain
      await window.keplr.enable("injective-1"); // mainnet
      
      // Get the offlineSigner
      const offlineSigner = window.keplr.getOfflineSigner("injective-1");
      
      // Get accounts
      const accounts = await offlineSigner.getAccounts();
      const address = accounts[0].address;
      
      // Save address
      setWalletAddress(address);
      localStorage.setItem('walletAddress', address);
      
      console.log("Connected to wallet:", address);
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      alert("Failed to connect wallet. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    localStorage.removeItem('walletAddress');
  };

  const value = {
    walletAddress,
    isConnecting,
    isConnected: !!walletAddress,
    connectWallet,
    disconnectWallet,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}; 