const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const Hotel = require('../models/hotel');

const DATA_PATH = path.join(
  path.dirname(process.mainModule.filename),
  '..',
  'datas',
  'hotels.json'
);

const hotels = fs.readFileSync(DATA_PATH, 'utf8');
const hotelDatas = JSON.parse(hotels);

const datas = hotelDatas.map(hotel => {
  return {
    _id: hotel._id.$oid,
    name: hotel.name,
    type: hotel.type,
    city: hotel.city,
    address: hotel.address,
    distance: hotel.distance,
    photos: hotel.photos,
    desc: hotel.desc,
    rating: hotel.rating,
    featured: hotel.featured,
    cheapestPrice: hotel.cheapestPrice,
    rooms: hotel.rooms,
  };
});

mongoose
  .connect(
    'mongodb+srv://hana:hanamiru@asm2.2afdksc.mongodb.net/booking?retryWrites=true&w=majority'
  )
  .then(result => {
    Hotel.insertMany(datas)
      .then(() => {
        console.log('Dữ liệu đã được nhập thành công.');
        // Đóng kết nối tới cơ sở dữ liệu
        mongoose.connection.close();
      })
      .catch(err => {
        console.error('Lỗi khi nhập dữ liệu:', err);
        // Đóng kết nối tới cơ sở dữ liệu
        mongoose.connection.close();
      });
  })
  .catch(err => {
    console.log(err);
  });
