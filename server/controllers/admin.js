const Transaction = require("../models/transaction");
const Hotel = require("../models/hotel");
const Room = require("../models/room");
const User = require("../models/user");

const paging = require("../utils/pagination");

exports.getOverall = (req, res, next) => {
  const result = {};

  User.countDocuments()
    // Đếm số lượng người dùng
    .then((num) => {
      result.users = num;
      return result;
    })
    // Đếm số lượng transactions
    .then(() => {
      return Transaction.countDocuments().then((num) => {
        result.transactions = num;
      });
    })
    //Tính tổng doanh thu dựa theo transaction price
    .then(() => {
      return Transaction.find().then((transactions) => {
        const totalSales = transactions.reduce(
          (acc, cur) => acc + cur.price,
          0
        );
        result.totalSales = totalSales;
      });
    })
    .then(() => {
      res.status(200).json(result);
    })
    .catch((err) => res.status(500).json(err));
};

// Tìm tất cả transactions
exports.getAllTransactions = (req, res, next) => {
  Transaction.find()
    .populate("hotel", "title name")
    .then((transactions) => {
      const data = paging(transactions.reverse(), req);
      res.status(200).json(data);
    })
    .catch((err) => res.status(500).json(err));
};

//Tìm 8 transactions gần nhất
exports.getLatestTransactions = (req, res, next) => {
  Transaction.find()
    .populate("hotel", "title name")
    .then((transactions) => {
      const data = paging(transactions.reverse(), req);
      res.status(200).json(data);
    })
    .catch((err) => res.status(500).json(err));
};

exports.getHotels = (req, res, next) => {
  Hotel.find()
    .then((hotels) => {
      res.status(200).json(hotels);
    })
    .catch((err) => res.status(500).json(err));
};

exports.getHotelDetail = (req, res, next) => {
  const hotelId = req.params.hotelId;

  Hotel.findOne({ _id: hotelId })
    .populate("rooms", "title -_id")
    .exec()
    .then((hotel) => {
      if (!hotel) {
        return res.status(404).json("Cannot find hotel detail");
      }
      const updatedRooms = hotel.rooms.map((room) => room.title);
      const updatedHotel = { ...hotel._doc, rooms: updatedRooms };
      res.status(200).json(updatedHotel);
    })
    .catch((err) => res.status(500).json(err));
};

exports.postAddHotel = (req, res, next) => {
  const hotelName = req.body.name;
  const hotelType = req.body.type;
  const hotelCity = req.body.city;
  const hotelAddress = req.body.address;
  const hotelDistance = req.body.distance;
  const hotelPhotos = req.body.photos;
  const hotelDesc = req.body.desc;
  const hotelRating = req.body.rating;
  const hotelFeatured = req.body.featured;
  const hotelRooms = req.body.rooms;
  const hotelTitle = req.body.title;
  const hotelPrice = req.body.cheapestPrice;

  Room.find({ title: { $in: hotelRooms } })
    .then((rooms) => {
      const results = rooms.map((room) => room._id);

      const hotel = new Hotel({
        name: hotelName,
        type: hotelType,
        city: hotelCity,
        address: hotelAddress,
        distance: hotelDistance,
        photos: hotelPhotos,
        desc: hotelDesc,
        rating: hotelRating,
        title: hotelTitle,
        featured: hotelFeatured,
        rooms: results,
        cheapestPrice: hotelPrice,
      });

      return hotel.save();
    })
    .then(() => {
      return res.status(201).json("Hotel created !!!");
    })
    .catch((err) => {
      return res.status(500).json(err.message);
    });
};

exports.postEditHotel = (req, res, next) => {
  const hotelId = req.params.hotelId;
  const hotelName = req.body.name;
  const hotelType = req.body.type;
  const hotelCity = req.body.city;
  const hotelAddress = req.body.address;
  const hotelDistance = req.body.distance;
  const hotelPhotos = req.body.photos;
  const hotelDesc = req.body.desc;
  const hotelRating = req.body.rating;
  const hotelFeatured = req.body.featured;
  const hotelRooms = req.body.rooms;
  const hotelTitle = req.body.title;
  const hotelPrice = req.body.cheapestPrice;

  Hotel.findById(hotelId)
    .then((hotel) => {
      return Room.find({ title: { $in: hotelRooms } }).then((rooms) => {
        const results = rooms.map((room) => room._id);

        hotel.name = hotelName;
        hotel.type = hotelType;
        hotel.city = hotelCity;
        hotel.address = hotelAddress;
        hotel.distance = hotelDistance;
        hotel.photos = hotelPhotos;
        hotel.desc = hotelDesc;
        hotel.rating = hotelRating;
        hotel.title = hotelTitle;
        hotel.featured = hotelFeatured;
        hotel.rooms = results;
        hotel.cheapestPrice = hotelPrice;

        return hotel.save();
      });
    })
    .then((result) => {
      console.log(result);
      res.status(201).json("Chỉnh sửa thông tin phòng thành công");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
};

exports.postDeleteHotel = (req, res, next) => {
  const hotelId = req.body.hotelId;
  console.log(hotelId);

  //Kiểm tra xem ks có trong bất kì transaction nào chưa
  Hotel.findOne({ _id: hotelId })
    .then((hotel) => {
      return Transaction.find({ hotel: hotel });
    })
    .then((transactions) => {
      //Nếu có thì không cho phép xóa
      if (transactions.length > 0) {
        return res
          .status(409)
          .json(
            "Không thể xóa khách sạn này do đã tồn tại giao dịch có liên quan"
          );
      } else {
        // Không thì tiến hành xóa
        return Hotel.findByIdAndRemove(hotelId).then(() => {
          res.status(201).json("Hotel Deleted !!!");
        });
      }
    })
    .catch(() => {
      res.status(500).json("Cannot Delete !!!");
    });
};

// Tìm toàn bộ phòng
exports.getRooms = (req, res, next) => {
  Room.find()
    .then((rooms) => {
      res.status(200).json(rooms);
    })
    .catch((err) => res.status(500).json(err));
};

// Tìm detail phòng để đưa vào phần edit
exports.getRoomDetail = (req, res, next) => {
  const roomId = req.params.roomId;

  Room.find({ _id: roomId })
    .then((rooms) => {
      if (rooms.length === 0) {
        return res.status(404).json("Cannot find room detail");
      }
      res.status(200).json(rooms[0]);
    })
    .catch((err) => res.status(500).json(err));
};

exports.postEditRoom = (req, res, next) => {
  const roomId = req.params.roomId;
  const roomTitle = req.body.title;
  const roomPrice = req.body.price;
  const roomDesc = req.body.desc;
  const roomMaxPeople = req.body.maxPeople;
  const roomNumbers = req.body.roomNumbers;

  Room.findById(roomId)
    .then((room) => {
      room.title = roomTitle;
      room.price = roomPrice;
      room.desc = roomDesc;
      room.maxPeople = roomMaxPeople;
      room.roomNumbers = roomNumbers;

      return room.save();
    })
    .then(() => {
      res.status(201).json("Chỉnh sửa thông tin phòng thành công");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
};

exports.postDeleteRoom = (req, res, next) => {
  const roomId = req.body.roomId;
  const today = new Date();

  //Kiểm tra xem phòng có đang được đặt hay không
  Transaction.find({ "room.roomType": roomId, dateEnd: { $gt: today } })
    .then((transactions) => {
      //Nếu có thì không được xóa
      if (transactions.length > 0) {
        return res
          .status(409)
          .json("Không thể xóa phòng này do đang có khách hàng đặt");
      } else {
        //Nếu không thì tiến hành xóa
        return Room.findByIdAndRemove(roomId).then(() => {
          res.status(201).json("Room Deleted !!!");
        });
      }
    })
    .catch(() => {
      res.status(500).json("Cannot Delete !!!");
    });
};

exports.postAddNewRoom = (req, res, next) => {
  const roomTitle = req.body.title;
  const roomPrice = req.body.price;
  const roomDesc = req.body.desc;
  const roomMaxPeople = req.body.maxPeople;
  const roomNumbers = req.body.roomNumbers;

  const room = new Room({
    title: roomTitle,
    price: roomPrice,
    maxPeople: roomMaxPeople,
    desc: roomDesc,
    roomNumbers: roomNumbers,
  });

  room
    .save()
    .then(() => {
      return res.status(201).json("Hotel created !!!");
    })
    .catch((err) => {
      return res.status(500).json(err.message);
    });
};
