const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');

/**
 * @route GET /api/agents
 * @desc Get all agents
 * @access Public
 */
router.get('/', agentController.getAgents);

/**
 * @route POST /api/agents/generate-config
 * @desc Generate agent configuration
 * @access Public
 */
router.post('/generate-config', agentController.generateConfig);

/**
 * @route GET /api/agents/templates
 * @desc Get agent templates
 * @access Public
 */
router.get('/templates', agentController.getAgentTemplates);

/**
 * @route POST /api/agents
 * @desc Create a new agent
 * @access Public
 */
router.post('/', agentController.saveAgent);

/**
 * @route GET /api/agents/:id
 * @desc Get agent by ID
 * @access Public
 */
router.get('/:id', agentController.getAgentById);

/**
 * @route PUT /api/agents/:id
 * @desc Update an agent
 * @access Public
 */
router.put('/:id', agentController.updateAgent);

/**
 * @route POST /api/agents/:id/deploy
 * @desc Deploy an agent
 * @access Public
 */
router.post('/:id/deploy', agentController.deployAgent);

module.exports = router; 