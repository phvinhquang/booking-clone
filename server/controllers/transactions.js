const Transaction = require("../models/transaction");
const User = require("../models/user");

exports.addTransaction = (req, res, next) => {
  User.findById(req.userId)
    .then((user) => {
      const username = user.username;
      const hotel = req.body.hotel;
      const room = req.body.room;
      const dateStart = req.body.dateStart + "T00:00:00Z";
      const dateEnd = req.body.dateEnd + "T00:00:00Z";
      const price = req.body.price;
      const payment = req.body.payment;
      const status = req.body.status;

      const transaction = new Transaction({
        user: username,
        hotel: hotel,
        room: room,
        dateStart: dateStart,
        dateEnd: dateEnd,
        price: price,
        payment: payment,
        status: status,
      });

      return transaction.save();
    })
    .then(() => {
      res.status(201).json("Reservation created !!!");
    })
    .catch((err) => {
      console.log(err);
      res.status(501).json("Can not create reservation");
    });
};

exports.getTransactions = (req, res, next) => {
  User.findById(req.userId)
    .then((user) => {
      return Transaction.find({ user: user.username }).populate(
        "hotel",
        "title"
      );
    })
    .then((transactions) => {
      res.status(200).json(transactions);
    })
    .catch(() => {
      res.status(500).json("Something went wrong");
    });
};
