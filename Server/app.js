const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const userRoute = require('./routes/user');
const hotelRoute = require('./routes/hotel');
const roomRoute = require('./routes/room');
const transactionRoute = require('./routes/transaction');
const adminRoute = require('./routes/admin');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use('/user', userRoute);
app.use('/hotel', hotelRoute);
app.use('/room', roomRoute);
app.use('/transaction', transactionRoute);
app.use('/admin', adminRoute);

mongoose
  .connect(
    'mongodb+srv://hana:hanamiru@asm2.2afdksc.mongodb.net/booking?retryWrites=true&w=majority'
  )
  .then(result => {
    app.listen(8080);
  })
  .catch(err => {
    console.log(err);
  });
