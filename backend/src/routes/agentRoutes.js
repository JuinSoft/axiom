const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');

// GET /api/agents - Get all agents for a user
router.get('/', agentController.getAgents);

// GET /api/agents/:id - Get a single agent by ID
router.get('/:id', agentController.getAgentById);

// POST /api/agents - Create a new agent
router.post('/', agentController.createAgent);

// PUT /api/agents/:id - Update an agent
router.put('/:id', agentController.updateAgent);

// DELETE /api/agents/:id - Delete an agent
router.delete('/:id', agentController.deleteAgent);

module.exports = router; 