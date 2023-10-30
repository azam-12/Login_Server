const express = require("express");
const {
  registerUser,
  loginUser,
  findUser,
  getUsers,
  verifyEmail,
  verifyUser,
  forgotUser,
  resetPassword,
} = require("../Controllers/userController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify", verifyUser);
router.post("/forgot", forgotUser);
router.post("/reset", resetPassword);


router.post("/verify-email", verifyEmail)

// router.get("/verify/:userEmail", verifyUser);
router.get("/find/:userId", findUser);
router.get("/", getUsers);


module.exports = router;
