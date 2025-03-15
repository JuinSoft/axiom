const express = require('express');
const router = express.Router();
const marketplaceController = require('../controllers/marketplaceController');

// Get all agents in the marketplace
router.get('/', marketplaceController.getAgents);

// Get agent details by ID
router.get('/:id', marketplaceController.getAgentDetails);

// Purchase an agent
router.post('/:id/purchase', marketplaceController.purchaseAgent);

// List an agent in the marketplace
router.post('/', marketplaceController.listAgent);

module.exports = router; 