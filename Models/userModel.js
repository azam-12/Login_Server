const mongoose = require("mongoose");

require("dotenv").config();

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 3, maxlength: 30 },
    email: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 200,
      unique: true,
    },
    isd: { type: String, required: true, minlength: 2, maxlength: 3 },
    phone: { type: String, required: true, minlength: 10, maxlength: 10 },
    password: { type: String, required: true, minlength: 3, maxlength: 1024 },
    role: {
      type: String,
      default: 0,     //  0 is for emplyee, 1 is for admin
    },
    // verified:{
    //   type: Boolean,
    //   default: false
    // },
    // emailToken: { type: String },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
