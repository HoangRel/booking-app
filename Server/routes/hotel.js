const express = require('express');
const router = express.Router();

const hotelControllers = require('../controllers/hotel');

router.get('/city', hotelControllers.byCity);
router.get('/type', hotelControllers.byType);
router.get('/top3', hotelControllers.top3);
router.get('/search', hotelControllers.search);
router.get('/:hotelId', hotelControllers.getHotel);

module.exports = router;
