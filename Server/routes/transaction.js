const express = require('express');

const router = express.Router();

const transactionControllers = require('../controllers/transaction');

router.post('/booked', transactionControllers.addTransaction);
router.get('/history', transactionControllers.getTransactionsByUserId);

module.exports = router;
