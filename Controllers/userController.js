const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const userModel = require("../Models/userModel");
const crypto = require("crypto");
const { sendOTPMail } = require("../utils/sendOTPMail");



const createToken = (_id) => {
  const jwtSecretKey = process.env.JWT_SECRET_KEY;

  return jwt.sign({ _id }, jwtSecretKey, { expiresIn: "3d" });
};



const registerUser = async (req, res) => {
  const { name, email, isd, phone, password } = req.body;

  try {
    let user = await userModel.findOne({ email });
    if (user) return res.status(400).json("User already exists...");

    user = new userModel({
      name,
      email,
      isd,
      phone,
      password,
    });

    if (!name || !email || !isd || !phone || !password)
      return res.status(400).json("All fields are required...");

    if (!validator.isEmail(email))
      return res.status(400).json("Email must be a valid email...");

    console.log('isd.length', isd.length)

    if (!(isd.length > 1 && isd.length < 4))
      return res.status(400).json("ISD code must be a 2 - 3 digit number..");

    if (phone.length !== 10)
      return res.status(400).json("Phone number must be a 10 digit number..");

    if (!validator.isStrongPassword(password))
      return res.status(400).json("Password must have a lower case letter, a upper case letter and a special character..");

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // generate otp and send it to email code starts
    let tempUser = { otp: null, email: null }
    const OTP = Math.floor(100000 + Math.random() * 900000)
    tempUser.otp = OTP
    tempUser.email = user.email
    sendOTPMail(tempUser)
    // generate otp and send it to email code ends

    res.status(200).json({ email: tempUser.email, otp: tempUser.otp });

  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};



const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {

    if (!email || !password)
      return res.status(400).json("All fields are required...");

    if (!validator.isEmail(email))
      return res.status(400).json("Invalid email or password...");

    if (!validator.isStrongPassword(password))
      return res.status(400).json("Password must have a lower case letter, a upper case letter and a special character..");

    let user = await userModel.findOne({ email });

    if (!user) return res.status(400).json("Invalid email or password...");

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json("Invalid email or password...");

    // generate otp and send it to email code starts
    let tempUser = { otp: null, email: null }
    const OTP = Math.floor(100000 + Math.random() * 900000)
    tempUser.otp = OTP
    tempUser.email = user.email
    sendOTPMail(tempUser)
    // generate otp and send it to email code ends

    res.status(200).json({ email: tempUser.email, otp: tempUser.otp });

  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};




const forgotUser = async (req, res) => {
  const { email } = req.body;

  try {

    if (!email)
      return res.status(400).json("Email is required...");

    if (!validator.isEmail(email))
      return res.status(400).json("Email must be a valid email...");

    let user = await userModel.findOne({ email });

    if (!user) return res.status(400).json("Invalid email...");

    // generate otp and send it to email code starts
    let tempUser = { otp: null, email: null }
    const OTP = Math.floor(100000 + Math.random() * 900000)
    tempUser.otp = OTP
    tempUser.email = user.email
    sendOTPMail(tempUser)
    // generate otp and send it to email code ends

    res.status(200).json({ email: tempUser.email, otp: tempUser.otp });

  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};


// This single function will be used to resend otp (if part) and verify user (else part)
const verifyUser = async (req, res) => {
  // const email = req.params.userEmail;

  const { email, resendOTP } = req.body;

  // This if loop executes if resend OTP link is clicked and we return back to the page or in else part the user is verified.
  if (resendOTP) {
    // generate otp and send it to email code starts
    let tempUser = { otp: null, email: null }
    const OTP = Math.floor(100000 + Math.random() * 900000)
    tempUser.otp = OTP
    tempUser.email = email
    sendOTPMail(tempUser)
    // generate otp and send it to email code ends

    res.status(200).json({ email: tempUser.email, otp: tempUser.otp });
  } else {

    try {
      const user = await userModel.findOne({ email });

      if (!user) return res.status(400).json("User registration is required");

      const token = createToken(user._id);

      res.status(200).json({ _id: user._id, name: user.name, email, token });
    }
    catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }


};


const resendOTP = async (req, res) => {
  const email = req.params.userEmail;

  try {

    const user = await userModel.findOne({ email });

    if (!user) return res.status(400).json("User registration is required");

    // generate otp and send it to email code starts
    let tempUser = { otp: null, email: null }
    const OTP = Math.floor(100000 + Math.random() * 900000)
    tempUser.otp = OTP
    tempUser.email = user.email
    sendOTPMail(tempUser)
    // generate otp and send it to email code ends

    res.status(200).json({ email: tempUser.email, otp: tempUser.otp });

  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};




const resetPassword = async (req, res) => {
  const { email, password } = req.body;

  try {

    if (!email || !password)
      return res.status(400).json("All fields are required...");

    if (!validator.isEmail(email))
      return res.status(400).json("Invalid email...");

    if (!validator.isStrongPassword(password))
      return res.status(400).json("Password must have a lower case letter, a upper case letter and a special character..");

    let user = await userModel.findOne({ email });

    if (!user) return res.status(400).json("Invalid email...");

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.status(200).json({ message: 'Password updated successfully! Login with new password to continue...' });

    // res.status(200).json({ email: tempUser.email, otp: tempUser.otp });

  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};










const findUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await userModel.findById(userId);

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
};



const getUsers = async (req, res) => {
  try {
    const users = await userModel.find();

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
};




const verifyEmail = async (req, res) => {
  try {
    const emailToken = req.body.emailToken

    if (!emailToken) return res.status(404).json("EmailToken not found!...")

    const user = await userModel.findOne({ emailToken })

    if (user) {
      user.emailToken = null
      user.verified = true

      await user.save()
      const token = createToken(user._id)

      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token,
        isVerified: user?.verified,
      })
    } else res.status(404).json("Email verification failed, invalid token!")
  } catch (error) {
    console.log(error)
    res.status(500).json(error.message)
  }
}


module.exports = { registerUser, loginUser, findUser, getUsers, verifyEmail, verifyUser, resendOTP, forgotUser, resetPassword };
