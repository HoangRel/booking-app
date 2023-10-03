const jwt = require('jsonwebtoken');

const secret = 'Booking';

const generateAuthToken = user => {
  const token = jwt.sign(
    { userId: user._id },
    secret
    //   {
    //   expiresIn: '3h',
    // }
  );

  return token;
};

const decodedToken = token => {
  try {
    const tokenValue = token.split(' ')[1];
    const decoded = jwt.verify(tokenValue, secret);

    const userId = decoded.userId;
    return userId;
  } catch (err) {
    return null;
  }
};

exports.generateAuthToken = generateAuthToken;
exports.decodedToken = decodedToken;
