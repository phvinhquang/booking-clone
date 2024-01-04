const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
const ejs = require("ejs");

const Transaction = require("../models/transaction");
const Room = require("../models/room");
const User = require("../models/user");
const Hotel = require("../models/hotel");

const transport = nodemailer.createTransport({
  host: "smtp.gmail.email",
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: "phvinhquang63@gmail.com",
    pass: "khxg pxhm zdnk jdab",
  },
});

exports.addTransaction = async (req, res, next) => {
  let customerEmail, customerFullname;
  try {
    const user = await User.findById(req.userId);

    const username = user.username;
    const hotel = req.body.hotel;
    const room = req.body.room;
    const dateStart = req.body.dateStart + "T00:00:00Z";
    const dateEnd = req.body.dateEnd + "T00:00:00Z";
    const price = req.body.price;
    const payment = req.body.payment;
    const status = req.body.status;

    customerEmail = user.email;
    customerFullname = user.fullName;

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

    await transaction.save();

    // Gửi response
    res.status(201).json("Reservation created !!!");
  } catch (err) {
    // console.log(err);
    res.status(501).json("Can not create reservation");
  }
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

async function sendConfirmationEmail(customerFullname, customerEmail, rooms) {
  try {
    // Xử lý dữ liệu
    const hotelInfo = await Hotel.findById(req.body.hotel);
    const hotelName = hotelInfo.name;

    const roomIds = rooms.map((r) => r.roomId);

    const emailPath = path.join(
      __dirname,
      "../",
      "views",
      "email-confirm-order.ejs"
    );

    const emailToSend = await ejs.renderFile(emailPath, {
      data: {
        fullname: customerFullname,
        email: customerEmail,
        hotel: hotelName,
        // address: customerAddress,
      },
    });

    // Gửi email
    await transport.sendMail({
      from: "Fake Booking.com <booking@gmail.com>", // sender address
      to: customerEmail,
      subject: "Fake Booking.com - Reservation Confirm",
      html: emailToSend,
    });
  } catch (err) {
    throw err;
  }
}
