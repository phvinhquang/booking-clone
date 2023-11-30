const express = require("express");

const router = express.Router();

const transactionsController = require("../controllers/transactions");
const isAuth = require("../middleware/is-auth");

router.post(
  "/transactions/add-transaction",
  isAuth,
  transactionsController.addTransaction
);

router.get("/transactions", isAuth, transactionsController.getTransactions);

module.exports = router;
