const express = require('express');
const router = express.Router();
const marketplaceController = require('../controllers/marketplaceController');

// GET /api/marketplace - List all agents in the marketplace
router.get('/', marketplaceController.listMarketplaceAgents);

// GET /api/marketplace/:id - Get a single marketplace agent by ID
router.get('/:id', marketplaceController.getMarketplaceAgent);

// POST /api/marketplace/list - List an agent in the marketplace
router.post('/list', marketplaceController.listAgentInMarketplace);

// DELETE /api/marketplace/:agentId - Remove an agent from the marketplace
router.delete('/:agentId', marketplaceController.removeAgentFromMarketplace);

// POST /api/marketplace/purchase - Purchase an agent from the marketplace
router.post('/purchase', marketplaceController.purchaseAgent);

// POST /api/marketplace/rate - Rate an agent in the marketplace
router.post('/rate', marketplaceController.rateAgent);

module.exports = router; 