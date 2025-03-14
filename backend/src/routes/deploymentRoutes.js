const express = require('express');
const router = express.Router();
const deploymentController = require('../controllers/deploymentController');

// POST /api/deployment/deploy - Deploy an agent to the blockchain
router.post('/deploy', deploymentController.deployAgent);

// GET /api/deployment/status/:agentId - Get deployment status of an agent
router.get('/status/:agentId', deploymentController.getDeploymentStatus);

// PUT /api/deployment/:agentId - Update an agent's deployment
router.put('/:agentId', deploymentController.updateDeployment);

// GET /api/deployment/networks - Get available networks
router.get('/networks', deploymentController.getNetworks);

module.exports = router; 