const Hotel = require("../models/hotel");
const Transaction = require("../models/transaction");
const Room = require("../models/room");

const filterFunction = require("../utils/filter-function");

exports.getOverAll = (req, res, next) => {
  const overall = {};

  Hotel.find()
    .then((hotels) => {
      const hotelsInHanoi = hotels.filter((hotel) => hotel.city === "Ha Noi");
      const hotelsInHcm = hotels.filter(
        (hotel) => hotel.city === "Ho Chi Minh"
      );
      const hotelsInDanang = hotels.filter((hotel) => hotel.city === "Da Nang");

      overall.hotelsByCities = [
        { city: "Ha Noi", properties: hotelsInHanoi.length },
        { city: "Ho Chi Minh", properties: hotelsInHcm.length },
        { city: "Da Nang", properties: hotelsInDanang.length },
      ];

      return overall;
    })
    .then(() => {
      return Hotel.find().then((properties) => {
        const hotel = filterFunction.filterByType(properties, "hotel");
        const apartments = filterFunction.filterByType(
          properties,
          "apartments"
        );
        const resorts = filterFunction.filterByType(properties, "resorts");
        const villas = filterFunction.filterByType(properties, "villa");
        const cabins = filterFunction.filterByType(properties, "cabin");

        overall.types = [
          { type: "Hotel", number: hotel.length },
          { type: "Apartment", number: apartments.length },
          { type: "Villa", number: villas.length },
          { type: "Resort", number: resorts.length },
          { type: "Cabin", number: cabins.length },
        ];
      });
    })
    .then(() => {
      return Hotel.find().then((hotels) => {
        const sorted = hotels.sort((a, b) => {
          return b.rating - a.rating;
        });

        overall.topRate = sorted;
      });
    })
    .then(() => {
      res.status(200).json(overall);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

exports.getHotelDetail = (req, res, next) => {
  const hotelId = req.params.hotelId;

  Hotel.findOne({ _id: hotelId })
    .then((hotel) => res.status(200).json(hotel))
    .catch((err) => {
      res.status(500).json(err);
    });
};

exports.postHotelSearch = (req, res, next) => {
  //Trích xuất dữ liệu từ body
  const city = req.body.city;
  const dateStartBody = new Date(req.body.dateStart);
  const dateEndBody = new Date(req.body.dateEnd);
  const people = Number(req.body.people);
  const room = Number(req.body.room);

  //Lọc hotel theo search body
  Hotel.find()
    .populate("rooms", "maxPeople roomNumbers")
    .then((hotels) => {
      //Lọc theo thành phố
      const filteredByCity = hotels.filter(
        (hotel) => hotel.city.toLowerCase() === city.toLowerCase()
      );
      // console.log("city", filteredB/yCity);

      return filteredByCity;
    })
    .then((filteredByCity) => {
      //Tìm transaction liên quan đến mỗi hotel
      const filteredByTransaction = filteredByCity.map((hotel) => {
        let hotelWithNewVacancy;

        return Transaction.find({
          $and: [
            { hotel: hotel._id },
            { dateEnd: { $gte: dateStartBody } },
            { dateStart: { $lte: dateEndBody } },
          ],
        }).then((transactionsArr) => {
          // Array chứa những phòng đã được đặt trước của khách sạn
          const bookedRoomsObjectId = [];
          transactionsArr.map((trans) => {
            bookedRoomsObjectId.push(...trans.room);
          });

          //Chuyển booked rooms từ ObjectId thành String để có thể so sánh với hotel rooms
          const bookedRooms = bookedRoomsObjectId.map((room) => {
            return { ...room._doc, roomType: room.roomType.toString() };
          });

          // Lọc phòng còn trống trong ks
          const vacancyInHotel = hotel.rooms.map((hotelRoom) => {
            // Room number ban đầu của từng loại phòng trong ks
            let filteredRoomNum = [...hotelRoom.roomNumbers];

            // Loop qua những phòng đã được đặt, nếu phòng nào được đặt thì loại ra khỏi room number của khách sạn
            bookedRooms.forEach((bookedRoom) => {
              if (bookedRoom.roomType === hotelRoom._id.toString()) {
                filteredRoomNum = filteredRoomNum.filter(
                  (num) => bookedRoom.roomNumbers.indexOf(num) === -1
                );
              }
            });

            return { ...hotelRoom._doc, roomNumbers: filteredRoomNum };
          });

          // Dữ liệu mới của ks
          hotelWithNewVacancy = {
            ...hotel._doc,
            rooms: vacancyInHotel,
          };
          return hotelWithNewVacancy;
        });
      });
      return filteredByTransaction;
    })
    .then((hotelsPromise) => {
      //Xử lý array Promise trả về từ then phía trên
      return Promise.all(hotelsPromise);
    })
    .then((hotels) => {
      const filterByRoom = hotels
        //Lọc theo số lượng phòng còn lại của khách sạn
        .filter((hotel) => {
          let totalRoom = 0;
          hotel.rooms.forEach((room) => {
            totalRoom += room.roomNumbers.length;
          });

          return totalRoom >= room;
        })
        //Lọc theo số người tối đa 1 phòng
        .filter((hotel) => {
          const qualifiedRooms = hotel.rooms.filter((r) => {
            return r.maxPeople >= Math.ceil(people / room);
          });
          if (qualifiedRooms.length > 0) {
            return hotel;
          }
        });
      res.status(201).json(filterByRoom);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

exports.postRoomVacancy = (req, res, next) => {
  const hotelId = req.params.hotelId;
  const dateStart = new Date(req.body.dateStart);
  const dateEnd = new Date(req.body.dateEnd);

  Hotel.findOne({ _id: hotelId })
    .populate("rooms")
    .then((hotel) => {
      return Transaction.find({
        hotel: hotel._id,
        dateEnd: { $gt: dateStart },
        dateStart: { $lte: dateEnd },
      }).then((transactions) => {
        const bookedRooms = [];
        transactions.map((transaction) =>
          bookedRooms.push(...transaction.room)
        );

        // Lọc phòng còn trống trong ks
        const vacancyInHotel = hotel.rooms.map((hotelRoom) => {
          // Room number ban đầu của từng loại phòng trong ks
          let filteredRoomNum = [...hotelRoom.roomNumbers];

          // Loop qua những phòng đã được đặt, nếu phòng nào được đặt thì loại ra khỏi room number của khách sạn
          bookedRooms.forEach((bookedRoom) => {
            if (bookedRoom.roomType.toString() === hotelRoom._id.toString()) {
              filteredRoomNum = filteredRoomNum.filter(
                (num) => bookedRoom.roomNumbers.indexOf(num) === -1
              );
            }
          });

          return { ...hotelRoom._doc, roomNumbers: filteredRoomNum };
        });

        const hotelWithNewVacancy = { ...hotel._doc, rooms: vacancyInHotel };
        return hotelWithNewVacancy;
      });
    })
    .then((hotelWithNewVacancy) => {
      //Loại những phòng đã hết room number trống
      const filteredRooms = hotelWithNewVacancy.rooms.filter(
        (room) => room.roomNumbers.length > 0
      );

      return { ...hotelWithNewVacancy, rooms: filteredRooms };
    })
    .then((hotelWithNewVacancy) => {
      res.json(hotelWithNewVacancy);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};
