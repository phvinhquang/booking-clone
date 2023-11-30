const Transaction = require("../models/transaction");

exports.addTransaction = (req, res, next) => {
  const user = req.user.username;
  const hotel = req.body.hotel;
  const room = req.body.room;
  const dateStart = req.body.dateStart + "T00:00:00Z";
  const dateEnd = req.body.dateEnd + "T00:00:00Z";
  const price = req.body.price;
  const payment = req.body.payment;
  const status = req.body.status;

  const transaction = new Transaction({
    user: user,
    hotel: hotel,
    room: room,
    dateStart: dateStart,
    dateEnd: dateEnd,
    price: price,
    payment: payment,
    status: status,
  });

  transaction
    .save()
    .then(() => {
      res.status(201).json("Reservation created !!!");
    })
    .catch((err) => {
      console.log(err);
      res.status(501).json("Can not create reservation");
    });
};

exports.getTransactions = (req, res, next) => {
  Transaction.find({ user: req.user.username })
    .populate("hotel", "title")
    .then((transactions) => {
      res.status(200).json(transactions);
    })
    .catch(() => {
      res.status(500).json("Something went wrong");
    });
};
