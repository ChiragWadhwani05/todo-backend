import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { OTP } from "../models/otp.models.js";
import { sendMail } from "../utils/mail.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiError.js";

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000);
}

const registerOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const existedUser = await User.findOne({ email });

  if (existedUser) {
    throw new ApiError(409, "User already exists.");
  }

  const otp = generateOtp();

  sendMail({
    email,
    subject: `${otp} is your Todo Verification Code`,
    content: `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Your Todo Verification Code</title>
    </head>
    <body>
        <p>Thank you for choosing Todo! Your One-Time Password (OTP) for verification is:</p>
        <div style="background-color: #f0f0f0; padding: 10px; border-radius: 5px; margin-bottom: 10px;">
            <strong style="font-size: 18px;" id="otp">${otp}</strong>
        </div>
        <p>Please use this code to complete the verification process.</p>
        <p>If you have any questions or need further assistance, feel free to reach out to our support team.</p>
        <p>Best regards,<br/>The Todo Team</p>
    </body>
    </html>
    `,
  });

  await OTP.create({ email, otp });

  return res
    .status(201)
    .json(new ApiResponse(201, null, "OTP send successfully."));
});

export { registerOTP };
