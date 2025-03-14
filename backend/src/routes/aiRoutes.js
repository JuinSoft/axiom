const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// POST /api/ai/generate-config - Generate agent configuration from description
router.post('/generate-config', aiController.generateAgentConfig);

// POST /api/ai/optimize-config - Optimize agent configuration
router.post('/optimize-config', aiController.optimizeAgentConfig);

module.exports = router; 