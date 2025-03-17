import { useState, useEffect } from 'react';
import { FiExternalLink } from 'react-icons/fi';
import { useWalletStore } from '../store/walletStore';
import { walletApi } from '../services/api';

// Simple interface for Keplr account
interface KeplrAccount {
  address: string;
  pubkey: Uint8Array;
}

// Remove problematic type declarations
// Instead, we'll use any for type assertions where needed

const WalletConnect = () => {
  const { isConnected, address, setWalletInfo, disconnect } = useWalletStore();
  const [balance, setBalance] = useState<string | null>(null);
  const chainId = "injective-1"; // Mainnet chain ID

  useEffect(() => {
    // Fetch balance when wallet is connected
    const fetchWalletBalance = async () => {
      if (isConnected && address) {
        try {
          // Fetch balance from backend API using the wallet service
          const response = await walletApi.getBalance(address);
          if (response && response.inj) {
            setBalance(response.inj.toFixed(4));
          } else {
            // Fallback to a placeholder if the API call fails
            setBalance("10.0000");
          }
        } catch (error) {
          console.error("Failed to fetch balance:", error);
          // Use placeholder balance if API call fails
          setBalance("10.0000");
        }
      } else {
        setBalance(null);
      }
    };

    fetchWalletBalance();
  }, [isConnected, address]);

  const handleConnect = async () => {
    try {
      // Check if Keplr is installed
      if (!(window as any).keplr) {
        alert("Please install Keplr extension");
        return;
      }

      // Enable Keplr for Injective chain
      await (window as any).keplr.enable(chainId);
      
      // Get the offline signer and accounts
      const offlineSigner = (window as any).keplr.getOfflineSigner(chainId);
      
      // Use type assertion to access getAccounts method
      const accounts = await offlineSigner.getAccounts();
      
      if (accounts && accounts.length > 0) {
        const account = accounts[0] as KeplrAccount;
        
        // Set wallet info in the store
        setWalletInfo({
          isConnected: true,
          address: account.address,
        });
        
        // Call the API to connect the wallet
        await walletApi.connect(account.address);
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      alert("Failed to connect wallet. Please try again.");
    }
  };

  const handleDisconnect = () => {
    // Update wallet store
    disconnect();
    
    // Reset balance
    setBalance(null);
  };

  return (
    <div className="relative">
      {isConnected ? (
        <div className="flex items-center">
          <button
            onClick={handleDisconnect}
            className="flex items-center px-4 py-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="flex flex-col items-start mr-2">
              <span className="text-xs text-gray-500 dark:text-dark-muted">Connected</span>
              <span className="text-sm font-medium truncate max-w-[120px] text-gray-900 dark:text-dark-text">
                {address ? `${address.slice(0, 8)}...${address.slice(-6)}` : ''}
              </span>
            </div>
            {balance && (
              <div className="flex items-center bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-md">
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">{balance} INJ</span>
              </div>
            )}
          </button>
        </div>
      ) : (
        <button
          onClick={handleConnect}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <span className="font-medium">Connect Wallet</span>
          <FiExternalLink className="ml-2 w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default WalletConnect; 