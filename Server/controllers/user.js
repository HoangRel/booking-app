const User = require('../models/user');

const { generateAuthToken } = require('../utils/token');

exports.postAuth = (req, res, next) => {
  const reqEmail = req.body.email;
  const reqPassword = req.body.password;
  const mode = req.query.mode;

  if (mode === 'signUp') {
    // Kiểm tra xem email này đã được đăng ký chưa
    User.find({ email: reqEmail })
      .then(user => {
        //
        if (user.length > 0) {
          // console.log('had');
          return res.status(400).json({ message: 'Email đã tồn tại!' });
        }
        //
        else {
          const username = reqEmail.split('@')[0];
          const newUser = new User({
            username,
            email: reqEmail,
            password: reqPassword,
          });

          return newUser.save().then(result => {
            const resData = {
              message: 'Tạo tài khoản thành công!',
            };
            res.status(500).json(resData);
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  if (mode === 'signIn') {
    User.find({ email: reqEmail })
      .then(([user]) => {
        //
        if (user) {
          const checkPass = user.password === reqPassword;

          if (!checkPass) {
            return res.status(401).json({ message: 'Sai password!' });
          }

          // Đăng nhập thành công
          const token = generateAuthToken(user);

          const curUser = {
            username: user.username,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,

            token,
          };

          return res
            .status(200)
            .json({ message: 'Đăng nhập thành công!', curUser });
        }
        //
        else {
          return res.status(401).json({ message: 'Sai email hoặc password!' });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
};
