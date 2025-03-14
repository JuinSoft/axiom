import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import DesignStudioPage from './pages/DesignStudioPage';
import MarketplacePage from './pages/MarketplacePage';
import DeploymentPage from './pages/DeploymentPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import { WalletProvider } from './context/WalletContext';

function App() {
  return (
    <WalletProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="design-studio" element={<DesignStudioPage />} />
          <Route path="marketplace" element={<MarketplacePage />} />
          <Route path="deployment" element={<DeploymentPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </WalletProvider>
  );
}

export default App; 