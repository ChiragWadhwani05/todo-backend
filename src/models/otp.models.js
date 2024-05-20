import { Schema, model } from "mongoose";

const otpSchema = new Schema({
  otp: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60,
  },
});

const OTP = model("OTP", otpSchema);

export { OTP };
