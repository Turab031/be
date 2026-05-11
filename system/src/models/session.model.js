const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: [true, "user is required"],
    },
    refreshTokenHash: {
      type: String,
      required: [true, "refresh token hash is reqquired"],
    },
    ip: {
      type: String,
      required: [true, "ip address is required"],
    },
    userAgent: {
      type: String,
      required: [true, "user agent is required"],
    },
    revoked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);
const sessionModel = mongoose.model("sessions", sessionSchema);

module.exports = sessionModel;
