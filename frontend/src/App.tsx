import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import AgentDetails from './pages/AgentDetails';
import CreateAgent from './pages/CreateAgent';
import MyAgents from './pages/MyAgents';
import Chat from './pages/Chat';
import { useWalletStore } from './store/walletStore';

// Define the theme
const theme = extendTheme({
  colors: {
    brand: {
      50: '#e6f7ff',
      100: '#b3e0ff',
      200: '#80caff',
      300: '#4db3ff',
      400: '#1a9dff',
      500: '#0080ff',
      600: '#0066cc',
      700: '#004d99',
      800: '#003366',
      900: '#001a33',
    },
  },
});

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { isConnected } = useWalletStore();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ChakraProvider theme={theme}>
      <Router>
        <div className="flex h-screen bg-gray-100">
          <Sidebar isOpen={sidebarOpen} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Navbar onMenuClick={toggleSidebar} />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/marketplace/:id" element={<AgentDetails />} />
                <Route 
                  path="/create" 
                  element={isConnected ? <CreateAgent /> : <Dashboard />} 
                />
                <Route 
                  path="/my-agents" 
                  element={isConnected ? <MyAgents /> : <Dashboard />} 
                />
                <Route 
                  path="/chat/:agentId" 
                  element={isConnected ? <Chat /> : <Dashboard />} 
                />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </ChakraProvider>
  );
}

export default App; 