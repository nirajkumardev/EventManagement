// External Module
const express=require("express");
const router=express.Router;

// Local Module
const {registeruser, loginUser, verifyOtp}=require("../controller/authController");

router.post("/register",registeruser);
router.post*("/login", loginUser);
router.post("/verify-otp", verifyOtp);


module.exports.router;