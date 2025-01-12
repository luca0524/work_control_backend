const express = require('express');
const router = express.Router();
const bidController = require("../controllers/bidController");

router.get("/", bidController.getAllBids);

module.exports = router;