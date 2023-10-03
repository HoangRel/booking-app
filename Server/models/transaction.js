const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  user: {
    type: String,
    required: true,
  },

  hotel: {
    type: Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true,
  },
  room: [
    {
      type: Number,
      required: true,
    },
  ],
  dateStart: {
    type: Date,
    required: true,
  },
  dateEnd: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  payment: {
    type: String,
    default: 'Cash',
  },

  status: {
    type: String,
    default: 'Booked',
  },
});

module.exports = mongoose.model('Transaction', transactionSchema);
