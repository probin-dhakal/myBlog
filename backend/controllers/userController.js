import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { sendToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";

export const register = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("User avatar required", 400));
  }

  // console.log("Request Body:", req.body);
  // console.log("Uploaded File:", req.files);

  const { avatar } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

  if (!allowedFormats.includes(avatar.mimetype)) {
    return next(
      new ErrorHandler(
        "Invalid image format please provide one of these (png/jpg/jpeg/webp)",
        400
      )
    );
  }

  const { name, email, password, phone, role, education } = req.body;
  // console.log(req.body);
  // Validate input fields
  if (!name || !email || !password || !phone || !role || !education || !avatar) {
    return next(new ErrorHandler("Please fill all details", 400));
  }

  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  // console.log(existingUser);
  if (existingUser) {
    return next(new ErrorHandler("User already exists", 400));
  }
  const cloudinaryResponse = await cloudinary.uploader.upload(
    avatar.tempFilePath
  );

  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary error: ",
      cloudinaryResponse.error || "Unknown cloudinary error!"
    );
  }

  // Create the new user
  const newUser = await User.create({
    name,
    email,
    password, // Password will be hashed via the schema pre-save hook
    phone,
    role,
    education,
    avatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });

  sendToken(newUser, 200, "User registered successfully", res);
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return next(new ErrorHandler("Please provide full details", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }
  if (user.role !== role) {
    return next(new ErrorHandler(`User with role of ${role} not found`, 400));
  }

  sendToken(user, 200, "User logged in successfully", res);
});

export const logout = catchAsyncErrors((req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "User logged out successfully",
    });
});

export const getMyProfile = catchAsyncErrors((req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

export const getAllAuthors = catchAsyncErrors(async (req, res, next) => {
  const authors = await User.find({
    role: "Author",
  });
  res.status(200).json({
    success: true,
    authors,
  });
});
