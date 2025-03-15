const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');

// Generate agent configuration
router.post('/generate-config', agentController.generateConfig);

// Get agent templates
router.get('/templates', agentController.getTemplates);

// Create a new agent
router.post('/', agentController.saveAgent);

// Get an agent by ID
router.get('/:id', agentController.getAgentById);

// Update an agent
router.put('/:id', agentController.updateAgent);

// Deploy an agent
router.post('/:id/deploy', agentController.deployAgent);

module.exports = router; 