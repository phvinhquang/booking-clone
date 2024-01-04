require("dotenv").config();

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
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

exports.addTransaction = async (req, res, next) => {
  // let customerEmail, customerFullname;
  try {
    const user = await User.findById(req.userId);
    const hotelInfo = await Hotel.findById(req.body.hotel);
    const hotelName = hotelInfo.name;

    const username = user.username;
    const hotel = req.body.hotel;
    const room = req.body.room;
    const dateStart = req.body.dateStart + "T00:00:00Z";
    const dateEnd = req.body.dateEnd + "T00:00:00Z";
    const price = req.body.price;
    const payment = req.body.payment;
    const status = req.body.status;

    // console.log(req.body.dateStart, req.body.dateEnd);

    // customerEmail = user.email;
    // customerFullname = user.fullName;

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

    const emailData = {
      user: user.fullName,
      email: user.email,
      hotel: hotelName,
      dateStart: req.body.dateStart,
      dateEnd: req.body.dateEnd,
      rooms: room,
      price: price,
    };

    await transaction.save();

    // Gửi response
    res.status(201).json("Reservation created !!!");

    await sendConfirmationEmail(emailData);
  } catch (err) {
    console.log(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
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

async function sendConfirmationEmail(emailData) {
  try {
    // Xử lý dữ liệu

    const roomTitles = emailData.rooms.map((r) => r.roomTitle);

    const emailPath = path.join(
      __dirname,
      "../",
      "views",
      "booking-confirm-email.ejs"
    );

    const emailToSend = await ejs.renderFile(emailPath, {
      data: {
        fullname: emailData.user,
        dateStart: emailData.dateStart,
        dateEnd: emailData.dateEnd,
        hotel: emailData.hotel,
        roomTitles: roomTitles.join(", "),
        rooms: emailData.rooms,
        price: emailData.price,
      },
    });

    // Gửi email
    await transport.sendMail({
      from: "Fake Booking.com <booking@gmail.com>", // sender address
      to: emailData.email,
      subject: "Fake Booking.com - Reservation Confirm",
      html: emailToSend,
    });
  } catch (err) {
    console.log(err);
  }
}
