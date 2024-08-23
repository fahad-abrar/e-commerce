import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: [30, "name can not be exceed in 30 charecter"],
    minLength: [2, "name should be at least 2 charecter"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: true,
  },
  avatar: {
    public_id: {
      type: String,
      required: false,
    },
    url: {
      type: String,
      required: false,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.getJWTToken = function () {
  const payload = {
    id: this._id,
    name: this.name,
    email: this.email,
  };
  const secret = process.env.JWT_SECRET;
  const expires = process.env.JWT_EXPIRES;
  const token = jwt.sign(payload, secret, {
    expiresIn: expires,
  });
  return token;
};

const User = mongoose.model("User", userSchema);
export default User;
