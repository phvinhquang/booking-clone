const express = require("express");

const router = express.Router();

const adminController = require("../controllers/admin");

const isAuthAdmin = require("../middleware/is-auth-admin");

router.get("/admin/overall", isAuthAdmin, adminController.getOverall);

router.get(
  "/admin/transactions/all",
  isAuthAdmin,
  adminController.getAllTransactions
);

router.get(
  "/admin/transactions/latest",
  isAuthAdmin,
  adminController.getLatestTransactions
);

router.get("/admin/hotels", isAuthAdmin, adminController.getHotels);

router.get(
  "/admin/hotels/:hotelId",
  isAuthAdmin,
  adminController.getHotelDetail
);

router.post("/admin/new-hotel", isAuthAdmin, adminController.postAddHotel);

router.post(
  "/admin/delete-hotel",
  isAuthAdmin,
  adminController.postDeleteHotel
);

router.post(
  "/admin/edit-hotel/:hotelId",
  isAuthAdmin,
  adminController.postEditHotel
);

router.get("/admin/rooms", isAuthAdmin, adminController.getRooms);

router.get("/admin/rooms/:roomId", isAuthAdmin, adminController.getRoomDetail);

router.post("/admin/delete-room", isAuthAdmin, adminController.postDeleteRoom);

router.post("/admin/new-room", isAuthAdmin, adminController.postAddNewRoom);

router.post(
  "/admin/edit-room/:roomId",
  isAuthAdmin,
  adminController.postEditRoom
);

module.exports = router;
