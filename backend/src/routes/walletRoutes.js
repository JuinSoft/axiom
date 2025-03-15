const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');

/**
 * @route GET /api/wallet/balance
 * @desc Get wallet balance
 * @access Public
 */
router.get('/balance', walletController.getBalance);

/**
 * @route GET /api/wallet/transactions
 * @desc Get transaction history
 * @access Public
 */
router.get('/transactions', walletController.getTransactions);

/**
 * @route POST /api/wallet/connect
 * @desc Connect wallet
 * @access Public
 */
router.post('/connect', walletController.connectWallet);

/**
 * @route POST /api/wallet/disconnect
 * @desc Disconnect wallet
 * @access Public
 */
router.post('/disconnect', walletController.disconnectWallet);

module.exports = router; 