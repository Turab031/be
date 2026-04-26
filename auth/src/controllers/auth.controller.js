const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

async function registerUser(req, res) {
  const { userName, email, password } = req.body;

  const isUserAlreadyExist = userModel.findOne({ email });

  if (isUserAlreadyExist) {
    return res.status(409).json({
      message: "user already exist",
    });
  }

  const user = await userModel.create({
    userName,
    email,
    password,
  });

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
  );
  res.cookie("mama", token);
  res.status(201).json({
    message: "user registered successfully",
    user,
    token,
  });
}

module.exports = { registerUser };
