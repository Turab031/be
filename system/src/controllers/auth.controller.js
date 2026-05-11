const userModel = require("../models/user.model");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const sessionModel = require("../models/session.model");

async function register(req, res) {
  const { username, email, password } = req.body;

  const isAlreadyRegistered = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isAlreadyRegistered) {
    return res.status(400).json({
      message: "username or email already exist",
    });
  }

  const hashPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");

  const user = await userModel.create({
    username,
    email,
    password: hashPassword,
  });

  const refreshToken = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");
  const session = await sessionModel.create({
    user: user._id,
    refreshTokenHash,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });

  const accessToken = jwt.sign(
    {
      id: user._id,
      sessionId: session._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    },
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(201).json({
    message: "user registered successfully",
    user: {
      username: user.username,
      email: user.email,
    },
    accessToken,
  });
}

async function getMe(req, res) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "token not found",
    });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await userModel.findById(decoded.id);

  res.status(200).json({
    message: "user fetched successfully",
    user: {
      username: user.username,
      email: user.email,
    },
  });
  console.log(decoded);
}

async function refreshToken(req, res) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      message: "refresh token not found",
    });
  }

  const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

  const accessToken = jwt.sign(
    {
      id: decoded.id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    },
  );

  const newRefreshToken = jwt.sign(
    {
      id: decoded.id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    message: "access token refreshed successfully",
    accessToken,
  });
}

async function logout(req, res) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(400).json({
      message: "refresh token not found",
    });
  }

  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .diges("hex");

  const session = await sessionModel.findOne({
    refreshTokenHash,
    revoked: false,
  });
  if (!session) {
    return res.status(400).json({
      message: "invalid refresh token",
    });
  }
  session.revoked = true;
  await session.save();
  res.clearCookie("refreshToken");

  res.status(200).json({
    message: "logged out successfully",
  });
}

module.exports = { register, getMe, refreshToken, logout };
