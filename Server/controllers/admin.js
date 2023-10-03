const User = require('../models/user');
const Transaction = require('../models/transaction');
const Hotel = require('../models/hotel');
const Room = require('../models/Room');

const { generateAuthToken, decodedToken } = require('../utils/token');

exports.postLogin = (req, res, next) => {
  const reqData = req.body;

  User.find({ email: reqData.email })
    .then(([user]) => {
      if (user) {
        if (!user.isAdmin) {
          return res
            .status(401)
            .json({ message: 'Tài khoản không có quuyền truy cập!' });
        }

        const checkPass = user.password === reqData.password;

        if (!checkPass) {
          return res.status(401).json({ message: 'Sai password!' });
        }

        // Đăng nhập thành công
        const token = generateAuthToken(user);

        return res
          .status(200)
          .json({ message: 'Đăng nhập thành công!', token });
      }
      //
      else {
        return res.status(401).json({ message: 'Sai email hoặc password!' });
      }
    })
    .catch(err => {
      console.log(err);
      return res.status(401).json({
        message: 'ERROR!',
      });
    });
};

////

// Middleware xác thực isAdmin
exports.authMiddleware = (req, res, next) => {
  const token = req.headers.authorization || null;

  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Yêu cầu đăng nhập lại' });
  }

  const userId = decodedToken(token);
  if (!userId) {
    return res.status(401).json({ message: 'Yêu cầu đăng nhập lại' });
  }

  User.findById(userId)
    .then(user => {
      if (!user.isAdmin) {
        return res.status(401).json({ message: 'Yêu cầu đăng nhập lại' });
      }

      next();
    })
    .catch(err => {
      console.log(err);
      return res.status(401).json({
        message: 'ERROR!',
      });
    });
};

////

exports.getDashboard = (req, res, next) => {
  let resUsers;
  let resOrders;
  let resEarnings;
  let resBalance;
  let resTransactions;

  User.find()
    .then(users => {
      resUsers = users.length - 1;
      return Transaction.find();
    })
    .then(result => {
      resTransactions = result;
      resOrders = result.length;
      resEarnings = result.reduce((total, item) => total + item.price, 0);
      resBalance = resEarnings / resOrders;

      return res.json({
        users: resUsers,
        orders: resOrders,
        earnings: resEarnings,
        balance: resBalance,
        transactions: resTransactions,
      });
    })
    .catch(err => {
      console.log(err);
      return res.status(401).json({
        message: 'ERROR!',
      });
    });
};

exports.getTransactions = (req, res, next) => {
  Transaction.find()
    .then(result => {
      return res.json(result);
    })
    .catch(err => {
      console.log(err);
      return res.status(401).json({
        message: 'ERROR!',
      });
    });
};

exports.getHotels = (req, res, next) => {
  Hotel.find()
    .then(result => {
      return res.json(result);
    })
    .catch(err => {
      console.log(err);
      return res.status(401).json({
        message: 'ERROR!',
      });
    });
};

exports.deleteHotel = (req, res, next) => {
  const id = req.params.id;
  Transaction.find({ hotel: id })
    .then(result => {
      if (result.length > 0) {
        const filteredResult = result.filter(mov => mov.status !== 'Checkout');
        if (filteredResult.length > 0) {
          return res
            .status(500)
            .json({ message: 'Vẫn còn khách. Không thể xóa!' });
        } else {
          // xóa hotel
          Hotel.findByIdAndDelete(id)
            .then(() => {
              return res.json({ message: 'Đã xóa!' });
            })
            .catch(err => {
              console.log(err);
              return res.status(401).json({
                message: 'ERROR!',
              });
            });
        }
      } else {
        // xóa hotel
        Hotel.findByIdAndDelete(id)
          .then(() => {
            return res.json({ message: 'Đã xóa!' });
          })
          .catch(err => {
            console.log(err);
            return res.status(401).json({
              message: 'ERROR!',
            });
          });
      }
    })
    .catch(err => {
      console.log(err);
      return res.status(401).json({
        message: 'ERROR!',
      });
    });
};

exports.editHotel = async (req, res, next) => {
  const id = req.params.id;
  const data = req.body;

  try {
    // Tìm hoặc tạo các phòng và lấy danh sách _id của chúng
    const roomIds = await Promise.all(
      data.rooms.map(async roomTitle => {
        let room = await Room.findOne({ title: roomTitle });
        if (!room) {
          return;
        }
        return room._id;
      })
    );

    data.rooms = roomIds;

    Hotel.findByIdAndUpdate(id, data, { new: true })
      .then(result => {
        return res.json({ message: 'Updated!' });
      })
      .catch(err => {
        console.log(err);
        return res.status(401).json({ message: 'FAILED!' });
      });
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: 'FAILED!' });
  }
};

exports.addNewHotel = async (req, res, next) => {
  const {
    name,
    type,
    city,
    address,
    distance,
    photos,
    desc,
    rating,
    featured,
    rooms,
    price: cheapestPrice,
  } = req.body;

  try {
    // Tìm hoặc tạo các phòng và lấy danh sách _id của chúng
    const roomIds = await Promise.all(
      rooms.map(async roomTitle => {
        let room = await Room.findOne({ title: roomTitle });
        if (!room) {
          return;
        }
        return room._id;
      })
    );

    const hotel = new Hotel({
      name,
      type,
      city,
      address,
      distance,
      photos,
      desc,
      rating: rating || null,
      featured,
      rooms: roomIds,
      cheapestPrice,
    });

    await hotel.save();
    return res.json({ message: 'Added!' });
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: 'ERROR' });
  }
};

exports.getRoomById = (req, res, next) => {
  const id = req.params.id;

  Room.findById({ _id: id })
    .then(room => {
      return res.json({ nameRoom: room.title });
    })
    .catch(err => {
      return res.json(null);
    });
};

exports.getRooms = (req, res, next) => {
  Room.find()
    .then(rooms => {
      return res.json(rooms);
    })
    .catch(err => {
      console.log(err);
      return res.status(401).json({ message: 'ERROR' });
    });
};

exports.deleteRoom = async (req, res, next) => {
  try {
    const id = req.params.id;

    // Kiểm tra và xác thực dữ liệu đầu vào
    if (!id) {
      return res.status(500).json({ message: 'ID phòng không hợp lệ.' });
    }

    // Tìm thông tin phòng và giao dịch liên quan
    const room = await Room.findById(id);
    if (!room) {
      return res.status(500).json({ message: 'Không tìm thấy phòng.' });
    }

    const hotels = await Hotel.find({ rooms: id });
    const hotelId = hotels.length > 0 ? hotels[0]._id : null;

    const transactions = await Transaction.find({ hotelId });

    // Kiểm tra xem phòng có giao dịch đang chưa hoàn tất
    const unfinishedTransactions = transactions.filter(
      transaction => transaction.status !== 'Checkout'
    );

    const roomNumbers = room.roomNumbers;
    const isBooked = unfinishedTransactions.some(transaction =>
      transaction.room.some(roomNumber => roomNumbers.includes(roomNumber))
    );

    if (isBooked) {
      return res.json({ message: 'Vẫn còn khách đặt phòng!' });
    }

    // Thực hiện xóa phòng
    await Room.findByIdAndDelete(id);

    return res.json({ message: 'Đã xóa phòng!' });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'LỖI!' });
  }
};

exports.editRoom = (req, res, next) => {
  const id = req.params.id;
  const data = req.body;
  const hotelId = req.body.hotelId;

  Room.findByIdAndUpdate(id, data, { new: true })
    .then(updatedRoom => {
      return Hotel.findById(hotelId);
    })
    .then(hotel => {
      if (hotel.rooms.includes(id)) {
        return hotel;
      }

      hotel.rooms.push(id);
      return hotel.save();
    })
    .then(updatedHotel => {
      res.json({ message: 'Updated!' });
    })
    .catch(err => {
      console.log(err);
      return res.status(401).json({ message: 'Lỗi!' });
    });
};

exports.addNewRoom = (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const maxPeople = req.body.maxPeople;
  const desc = req.body.desc;
  const roomNumbers = req.body.roomNumbers;
  const hotelId = req.body.hotelId;

  const invalidRooms = roomNumbers.filter(room => {
    return isNaN(room);
  });
  if (invalidRooms.length > 0) {
    return res.status(500).json({ message: 'rooms phải là kiểu Number!' });
  }

  const room = new Room({
    title,
    price,
    maxPeople,
    desc,
    roomNumbers,
  });

  room
    .save()
    .then(result => {
      const roomId = result._id;

      Hotel.findById(hotelId)
        .then(hotel => {
          hotel.rooms.push(roomId);
          return hotel.save();
        })
        .then(result => {
          return res.json({ message: 'Added' });
        });
    })
    .catch(err => {
      console.log(err);
      return res.status(401).json({ message: 'ERROR' });
    });
};

exports.getHotelofRoomId = (req, res, next) => {
  const id = req.params.id;

  Hotel.find({ rooms: id })
    .then(hotels => {
      return res.json(hotels);
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({ message: 'ERROR' });
    });
};

exports.getNameAndIdHotels = (req, res, next) => {
  Hotel.find()
    .then(hotels => {
      const nameIdHotel = hotels.map(hotel => {
        return { _id: hotel._id, name: hotel.name };
      });

      return res.json(nameIdHotel);
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({ message: 'ERROR' });
    });
};
