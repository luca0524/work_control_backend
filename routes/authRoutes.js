const express = require('express');
const router = express.Router();
const authController = require("../controllers/authController");
const authenticateToken = require("../middleware/authMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/user", authenticateToken ,authController.getUser);
router.put("/update", authController.update);
router.delete("/delete", authController.delete);

module.exports = router;