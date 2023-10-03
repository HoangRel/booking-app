const Hotel = require('../models/hotel');

exports.byCity = async (req, res, next) => {
  const hotelCity = {};
  await Hotel.find({ city: 'Ha Noi' }).then(hotels => {
    return (hotelCity.HaNoi = hotels);
  });
  await Hotel.find({ city: 'Da Nang' }).then(hotels => {
    return (hotelCity.DaNang = hotels);
  });
  await Hotel.find({ city: 'Ho Chi Minh' }).then(hotels => {
    return (hotelCity.HoChiMinh = hotels);
  });

  return res.json(hotelCity);
};

exports.byType = async (req, res, next) => {
  let propertys = {};

  await Hotel.find({ type: 'hotel' }).then(hotels => {
    return (propertys.hotels = hotels);
  });
  await Hotel.find({ type: 'apartment' }).then(apartments => {
    return (propertys.apartments = apartments);
  });
  await Hotel.find({ type: 'resort' }).then(resorts => {
    return (propertys.resorts = resorts);
  });
  await Hotel.find({ type: 'villa' }).then(villas => {
    return (propertys.villas = villas);
  });
  await Hotel.find({ type: 'cabin' }).then(cabins => {
    return (propertys.cabins = cabins);
  });

  return res.json(propertys);
};

exports.top3 = (req, res, next) => {
  Hotel.find()
    .sort({ rating: -1 })
    .limit(3)
    .then(hotels => {
      res.json(hotels);
    })
    .catch(err => {
      res.status(404).json({ message: 'ERROR!' });
    });
};

exports.search = async (req, res, next) => {
  const area = req.query.area || null;
  const startDate = req.query.startDate || null;
  const endDate = req.query.endDate || null;
  const room = parseInt(req.query.room) || 1;

  if (!area) {
    return res.status(400).json({ message: 'Where are you going?' });
  }

  let results;
  try {
    if (area) {
      results = await Hotel.find({
        city: { $regex: new RegExp(area, 'i') },
      });
    }

    if (startDate) {
      const startTime = new Date(startDate);
      let endTime = new Date(endDate);

      if (!endTime) {
        endTime = startTime;
      }

      results = results.filter(hotel => {
        if (hotel.bookingTimeRange) {
          const bookingStartTime = new Date(hotel.bookingTimeRange.start);
          const bookingEndTime = new Date(hotel.bookingTimeRange.end);

          // Kiểm tra trùng lặp ngày
          const isOverlap =
            startTime <= bookingEndTime && endTime >= bookingStartTime;

          return !isOverlap;
        }

        return hotel;
      });
    }

    // chỉ kiểm tra số phòng
    results = results.filter(hotel => {
      return hotel.rooms.length >= room;
    });

    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.getHotel = (req, res, next) => {
  const hoId = req.params.hotelId;

  return Hotel.findById(hoId)
    .then(product => {
      res.json(product);
    })
    .catch(err => {
      console.log(err);
    });
};
