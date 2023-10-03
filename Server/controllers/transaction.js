const User = require('../models/user');
const Transaction = require('../models/transaction');

const { decodedToken } = require('../utils/token');

exports.addTransaction = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Yêu cầu đăng nhập lại' });
  }

  const userId = decodedToken(token);
  if (!userId) {
    return res.status(401).json({ message: 'Yêu cầu đăng nhập lại' });
  }

  User.findById(userId)
    .then(user => {
      if (user) {
        const data = req.body;
        const transaction = new Transaction({ userId, ...data });

        return transaction.save().then(result => {
          return res.json({ message: 'Đặt phòng thành công!' });
        });
      }
    })
    .catch(err => {
      return res.status(401).json({ message: 'Yêu cầu đăng nhập lại' });
    });
};

exports.getTransactionsByUserId = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Yêu cầu đăng nhập' });
  }

  const userId = decodedToken(token);
  if (!userId) {
    return res.status(401).json({ message: 'Yêu cầu đăng nhập' });
  }

  return Transaction.find({ userId: userId })
    .populate('hotel', 'name')
    .then(result => {
      const data = result.map(mov => {
        return { ...mov.toObject(), hotel: mov.hotel.name };
      });

      return res.json(data);
    });
};
