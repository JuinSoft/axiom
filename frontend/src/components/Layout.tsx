import { Outlet, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Layout = () => {
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

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="text-2xl font-bold text-primary-600">
                  Axiom
                </Link>
              </div>
              <nav className="ml-6 flex space-x-8">
                <Link
                  to="/design-studio"
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                >
                  Design Studio
                </Link>
                <Link
                  to="/marketplace"
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                >
                  Marketplace
                </Link>
                <Link
                  to="/deployment"
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                >
                  Deployment
                </Link>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                >
                  Dashboard
                </Link>
              </nav>
            </div>
            <div className="flex items-center">
              {walletAddress ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">
                    {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
                  </span>
                  <button 
                    onClick={disconnectWallet}
                    className="btn btn-outline"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button 
                  onClick={connectWallet} 
                  disabled={isConnecting}
                  className="btn btn-primary"
                >
                  {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Axiom. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                Twitter
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                GitHub
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                Discord
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 