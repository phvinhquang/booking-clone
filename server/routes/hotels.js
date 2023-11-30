const express = require("express");

const router = express.Router();

const hotelsContoller = require("../controllers/hotels");

router.get("/overall", hotelsContoller.getOverAll);

router.get("/hotels/:hotelId", hotelsContoller.getHotelDetail);

router.post("/search", hotelsContoller.postHotelSearch);

router.post("/rooms/:hotelId", hotelsContoller.postRoomVacancy);

module.exports = router;
