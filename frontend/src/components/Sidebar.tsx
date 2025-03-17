import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiGrid, FiShoppingBag, FiPlusCircle, FiPackage, FiMessageSquare, FiLayers, FiServer, FiCode, FiBook, FiFileText } from 'react-icons/fi';
import { useWalletStore } from '../store/walletStore';
import WalletConnect from './WalletConnect';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const location = useLocation();
  const { isConnected } = useWalletStore();

  const navItems = [
    { name: 'Home', icon: FiHome, path: '/' },
    { name: 'Dashboard', icon: FiGrid, path: '/dashboard' },
    { name: 'Marketplace', icon: FiShoppingBag, path: '/marketplace' },
    { name: 'Design Studio', icon: FiLayers, path: '/design-studio' },
    { name: 'Deployment', icon: FiServer, path: '/deployment' },
    { name: 'Create Agent', icon: FiPlusCircle, path: '/create', requiresAuth: true },
    { name: 'My Agents', icon: FiPackage, path: '/my-agents', requiresAuth: true },
  ];

  const docItems = [
    { name: 'Developer Guide', icon: FiBook, path: '/developer-guide' },
    { name: 'API Reference', icon: FiFileText, path: '/api-reference' },
  ];

  // Group items by category
  const publicItems = navItems.filter(item => !item.requiresAuth);
  const authItems = navItems.filter(item => item.requiresAuth);

  return (
    <aside
      className={`fixed left-0 h-full bg-white dark:bg-dark-card border-r border-gray-200 dark:border-dark-border transition-all duration-300 z-10 overflow-x-hidden shadow-sm ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div className="flex flex-col h-full py-5">
        <div className={`px-${isOpen ? '6' : '4'} mb-8`}>
          <div className={`flex items-center ${isOpen ? 'justify-start' : 'justify-center'}`}>
            <div
              className={`${isOpen ? 'w-10 h-10' : 'w-12 h-12'} rounded-md bg-blue-500 flex items-center justify-center text-white font-bold ${
                isOpen ? 'text-xl mr-3' : 'text-2xl'
              }`}
            >
              i
            </div>
            {isOpen && (
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                Axiom
              </span>
            )}
          </div>
        </div>

        <div className="flex-1">
          {/* Public navigation */}
          <div className="mb-6">
            {isOpen && (
              <p className="px-6 text-xs font-bold uppercase text-gray-500 dark:text-dark-muted mb-3">
                PLATFORM
              </p>
            )}
            {publicItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <div key={item.name} className="mb-1">
                  <Link
                    to={item.path}
                    className="no-underline"
                  >
                    <div
                      className={`flex items-center py-3 px-4 ${
                        isOpen ? 'mx-3' : 'mx-auto'
                      } rounded-lg cursor-pointer transition-all duration-200 ${
                        isActive
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : 'bg-transparent text-gray-600 dark:text-dark-text hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400'
                      }`}
                    >
                      <div 
                        className={`${
                          isOpen ? 'mr-4' : ''
                        } ${
                          isActive ? 'text-blue-500 dark:text-blue-400' : ''
                        } w-6 h-6 flex items-center justify-center`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      {isOpen && (
                        <span className={`text-base ${isActive ? 'font-medium' : 'font-normal'}`}>
                          {item.name}
                        </span>
                      )}
                      {isActive && isOpen && (
                        <div className="absolute right-0 w-1 h-8 rounded-l bg-blue-500 dark:bg-blue-400"></div>
                      )}
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Auth required navigation */}
          {(authItems.length > 0) && (
            <div className="mb-6">
              {isOpen && (
                <p className="px-6 text-xs font-bold uppercase text-gray-500 dark:text-dark-muted mb-3">
                  MY WORKSPACE
                </p>
              )}
              {authItems.map((item) => {
                // Skip auth-required items if not connected
                if (item.requiresAuth && !isConnected) {
                  return null;
                }

                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                
                return (
                  <div key={item.name} className="mb-1">
                    <Link
                      to={item.path}
                      className="no-underline"
                    >
                      <div
                        className={`flex items-center py-3 px-4 ${
                          isOpen ? 'mx-3' : 'mx-auto'
                        } rounded-lg cursor-pointer transition-all duration-200 ${
                          isActive
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                            : 'bg-transparent text-gray-600 dark:text-dark-text hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400'
                        }`}
                      >
                        <div 
                          className={`${
                            isOpen ? 'mr-4' : ''
                          } ${
                            isActive ? 'text-blue-500 dark:text-blue-400' : ''
                          } w-6 h-6 flex items-center justify-center`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        {isOpen && (
                          <span className={`text-base ${isActive ? 'font-medium' : 'font-normal'}`}>
                            {item.name}
                          </span>
                        )}
                        {isActive && isOpen && (
                          <div className="absolute right-0 w-1 h-8 rounded-l bg-blue-500 dark:bg-blue-400"></div>
                        )}
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}

          {/* Documentation */}
          <div className="mb-6">
            {isOpen && (
              <p className="px-6 text-xs font-bold uppercase text-gray-500 dark:text-dark-muted mb-3">
                DOCUMENTATION
              </p>
            )}
            {docItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <div key={item.name} className="mb-1">
                  <Link
                    to={item.path}
                    className="no-underline"
                  >
                    <div
                      className={`flex items-center py-3 px-4 ${
                        isOpen ? 'mx-3' : 'mx-auto'
                      } rounded-lg cursor-pointer transition-all duration-200 ${
                        isActive
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : 'bg-transparent text-gray-600 dark:text-dark-text hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400'
                      }`}
                    >
                      <div 
                        className={`${
                          isOpen ? 'mr-4' : ''
                        } ${
                          isActive ? 'text-blue-500 dark:text-blue-400' : ''
                        } w-6 h-6 flex items-center justify-center`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      {isOpen && (
                        <span className={`text-base ${isActive ? 'font-medium' : 'font-normal'}`}>
                          {item.name}
                        </span>
                      )}
                      {isActive && isOpen && (
                        <div className="absolute right-0 w-1 h-8 rounded-l bg-blue-500 dark:bg-blue-400"></div>
                      )}
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Connect Wallet Section */}
        {!isConnected && isOpen && (
          <div className="p-5 mx-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg mb-3 border border-blue-100 dark:border-blue-900/50">
            <p className="text-sm font-medium mb-3 text-blue-800 dark:text-blue-300">
              Connect wallet to create and manage your agents
            </p>
            <WalletConnect />
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar; 