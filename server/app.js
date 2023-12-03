require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const bcrypt = require("bcryptjs");

const User = require("./models/user");
// const Transaction = require("./models/transaction");

//Import routes
const authRoutes = require("./routes/auth");
const hotelsRoutes = require("./routes/hotels");
const transactionsRoutes = require("./routes/transactions");
const adminRoutes = require("./routes/admin");

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
    `mongodb+srv://${process.env.MONGO_ACCOUNT}:${process.env.MONGO_PASSWORD}@funix-njs301-mongodb.1vi2stm.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
