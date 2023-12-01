const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const User = require("./models/user");
// const Transaction = require("./models/transaction");

//Import routes
const authRoutes = require("./routes/auth");
const hotelsRoutes = require("./routes/hotels");
const transactionsRoutes = require("./routes/transactions");
const adminRoutes = require("./routes/admin");
// const user = require("./models/user");

const app = express();
app.use(cors());

//Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use(authRoutes);
app.use(hotelsRoutes);
app.use(transactionsRoutes);
app.use(adminRoutes);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
    "mongodb+srv://jeremy:Cfc1031905@funix-njs301-mongodb.1vi2stm.mongodb.net/asm3?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });

// app.use((req, res, next) => {
//   const user = new User({
//     username: "Quang",
//     password: "11111111",
//     fullName: "Vinh Quang",
//     phoneNumber: "0335109989",
//     email: "phvinhquang@gmail.com",
//     isAdmin: true,
//   });

//   user.save();
// });

// app.use((req, res, next) => {
//   console.log("hello");
//   next();
// });

// app.use((req, res, next) => {
//   const transaction = new Transaction({
//     user: "Quang",
//     hotel: "6311a54a4a642f0142349086",
//     room: ["6310dd998cfecfd90b30ca28"],
//     dateStart: "2023-9-20",
//     dateEnd: "2023-9-23",
//     price: 100,
//     payment: "cash",
//     status: "Booked",
//   });

//   transaction.save();
// });
