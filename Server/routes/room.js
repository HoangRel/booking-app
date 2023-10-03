const express = require('express');

const router = express.Router();

const roomControllers = require('../controllers/room');

router.get('/findById', roomControllers.getRoomsById);

module.exports = router;
