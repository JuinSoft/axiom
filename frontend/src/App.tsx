import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import MarketplacePage from './pages/MarketplacePage';
import AgentDetails from './pages/AgentDetails';
import CreateAgent from './pages/CreateAgent';
import MyAgents from './pages/MyAgents';
import Chat from './pages/Chat';
import HomePage from './pages/HomePage';
import DesignStudioPage from './pages/DesignStudioPage';
import DeploymentPage from './pages/DeploymentPage';
import NotFoundPage from './pages/NotFoundPage';
import DeveloperGuidePage from './pages/DeveloperGuidePage';
import ApiReferencePage from './pages/ApiReferencePage';
import { useWalletStore } from './store/walletStore';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { isConnected } = useWalletStore();

  // Initialize dark mode based on user preference or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || 
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-dark-text">
      <Sidebar isOpen={sidebarOpen} />
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen ? 'ml-60' : 'ml-20'}`}>
        <Navbar onMenuClick={toggleSidebar} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-dark-bg p-6">
          <div className="container mx-auto">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/marketplace/:id" element={<AgentDetails />} />
              <Route path="/design-studio" element={<DesignStudioPage />} />
              <Route path="/deployment" element={<DeploymentPage />} />
              <Route path="/developer-guide" element={<DeveloperGuidePage />} />
              <Route path="/api-reference" element={<ApiReferencePage />} />
              <Route 
                path="/create" 
                element={isConnected ? <CreateAgent /> : <DashboardPage />} 
              />
              <Route 
                path="/my-agents" 
                element={isConnected ? <MyAgents /> : <DashboardPage />} 
              />
              <Route 
                path="/chat/:agentId" 
                element={isConnected ? <Chat /> : <DashboardPage />} 
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App; 