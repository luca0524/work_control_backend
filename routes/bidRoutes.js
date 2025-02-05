const express = require('express');
const router = express.Router();
const bidController = require("../controllers/bidController");

router.get("/", bidController.getAllBidInfos);
router.get("/todayInfo", bidController.getTodayBidInfo);
router.get("/lastInfo", bidController.getLastBidInfo);
router.get("/lastWeek", bidController.getLastWeekBidInfos);
router.get("/thisWeek", bidController.getThisWeekBidInfos);
router.get("/:id", bidController.getBidInfoById);

router.post("/", bidController.createBidInfo);

router.put("/:id", bidController.updateBidInfoById);
router.put("/", bidController.updateBidInfo);

router.delete("/:id", bidController.deleteBidInfoById);

module.exports = router;