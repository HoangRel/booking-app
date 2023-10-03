const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hotelSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  distance: {
    type: String,
    required: true,
  },
  photos: [
    {
      type: String,
      required: true,
    },
  ],
  desc: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  cheapestPrice: {
    type: Number,
  },
  rooms: [
    {
      type: String,
    },
  ],
  bookingTimeRange: {
    start: Date,
    end: Date,
  },
});

module.exports = mongoose.model('Hotel', hotelSchema);
