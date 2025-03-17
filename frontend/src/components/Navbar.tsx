import { FiMenu, FiSearch, FiBell, FiUser } from 'react-icons/fi';
import { useWalletStore } from '../store/walletStore';
import WalletConnect from './WalletConnect';
import DarkModeToggle from './DarkModeToggle';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { isConnected } = useWalletStore();

  return (
    <nav className="bg-white dark:bg-dark-bg border-b border-gray-200 dark:border-dark-border py-3 px-6 shadow-sm sticky top-0 z-10">
      <div className="flex items-center h-16">
        <div 
          onClick={onMenuClick} 
          className="cursor-pointer mr-4 p-2 w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
        >
          <FiMenu className="w-5 h-5 text-gray-600 dark:text-dark-text" />
        </div>
        
        <div className="max-w-md mx-6 hidden md:flex relative items-center flex-1">
          <div className="absolute left-3 z-10 w-5 h-5 flex items-center justify-center text-gray-500 dark:text-dark-muted">
            <FiSearch className="w-5 h-5" />
          </div>
          <input 
            placeholder="Search agents, tools..." 
            className="w-full pl-10 py-3 text-base bg-gray-50 dark:bg-dark-card text-gray-900 dark:text-dark-text border border-gray-300 dark:border-dark-border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-white dark:focus:bg-dark-card focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex-1 md:flex-none"></div>
        
        <div className="p-2 mr-3 cursor-pointer w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
          <FiBell className="w-5 h-5 text-gray-600 dark:text-dark-text" />
        </div>
        
        <div className="mr-4">
          <DarkModeToggle />
        </div>
        
        <WalletConnect />
        
        {isConnected && (
          <div className="ml-4 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white cursor-pointer hover:bg-blue-600 transition-colors">
            <FiUser className="w-5 h-5" />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 