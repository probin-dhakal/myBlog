import bcrypt from "bcrypt";
import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken"


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [3, "Name must contains at leat 3 characters"],
    maxLength: [50, "Name must contains atmost 50 characters"],
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Please provide a valid email"],
    unique: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  avatar: {
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
  },
  education: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["Reader", "Author"],
  },
  password: {
    type: String,
    required: true,
    minLength: [8, "Password must contains at leat 8 characters"],
    maxLength: [50, "Password must contains atmost 50 characters"],
    select: false,
  },
  createdOn: {
    type: Date,
    default: Date.now(),
  },
});

userSchema.pre("save", async function (next) {
  // Check if the password is modified
  if (!this.isModified("password")) {
    return next(); // Ensure 'next' is defined and used correctly
  }
  // Hash the password
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};




userSchema.methods.getJWTToken =  function() {
  return jwt.sign({
    id:this._id}, process.env.JWT_SECRET_KEY, {expiresIn: process.env.JWT_EXPIRES})
}
export const User = mongoose.model("User", userSchema);
