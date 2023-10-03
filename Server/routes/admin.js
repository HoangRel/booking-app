const express = require('express');
const router = express.Router();

const adminControllers = require('../controllers/admin');

const { authMiddleware } = require('../controllers/admin');

router.post('/login', adminControllers.postLogin);

router.get('/dashboard', authMiddleware, adminControllers.getDashboard);

router.get(
  '/getTransactions',
  authMiddleware,
  adminControllers.getTransactions
);

router.get('/getHotels', authMiddleware, adminControllers.getHotels);

router.post('/deleteHotel/:id', authMiddleware, adminControllers.deleteHotel);

router.put('/editHotel/:id', authMiddleware, adminControllers.editHotel);

router.post('/addNewHotel', authMiddleware, adminControllers.addNewHotel);

router.get('/getRooms', authMiddleware, adminControllers.getRooms);

router.get('/getRoomById/:id', authMiddleware, adminControllers.getRoomById);

router.post('/deleteRoom/:id', authMiddleware, adminControllers.deleteRoom);

router.put('/editRoom/:id', authMiddleware, adminControllers.editRoom);

router.post('/addNewRoom', authMiddleware, adminControllers.addNewRoom);

router.get(
  '/getHotelofRoomId/:id',
  authMiddleware,
  adminControllers.getHotelofRoomId
);

router.get(
  '/getNameAndIdHotels',
  authMiddleware,
  adminControllers.getNameAndIdHotels
);

module.exports = router;
