const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/register", userController.registerUser);

router.post("/login", userController.loginUsers);

router.get("/:id", userController.getUserById);

module.exports = router;