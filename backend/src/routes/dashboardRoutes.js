const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Get user's agents
router.get('/agents', dashboardController.getAgents);

// Get user's deployments
router.get('/deployments', dashboardController.getDeployments);

// Get user's analytics
router.get('/analytics', dashboardController.getAnalytics);

// Get user's transactions
router.get('/transactions', dashboardController.getTransactions);

module.exports = router; 