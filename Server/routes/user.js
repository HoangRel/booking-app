const express = require('express');

const bookingController = require('../controllers/user');

const router = express.Router();

router.post('/auth', bookingController.postAuth);

module.exports = router;
