const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    profileImageUrl: { type: String, default: null },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
