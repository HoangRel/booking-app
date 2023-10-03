const Room = require('../models/Room');

exports.getRoomsById = async (req, res, next) => {
  const double = req.query.double || null;
  const twin = req.query.twin || null;

  let doubleRooms;
  let twinRooms;

  if (double) {
    await Room.find({ _id: double })
      .then(rooms => {
        return (doubleRooms = rooms);
      })
      .catch(err => {
        console.log(err);
      });
  }

  if (twin) {
    await Room.find({ _id: twin })
      .then(rooms => {
        return (twinRooms = rooms);
      })
      .catch(err => {
        console.log(err);
      });
  }

  const resData = {
    doubleRooms,
    twinRooms,
  };

  return res.json(resData);
};
