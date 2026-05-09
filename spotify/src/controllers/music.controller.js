const musicModel = require("../models/music.model");
const jwt = require("jsonwebtoken");

async function createMusic(req, res) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "unautherized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role != "artist") {
      return res
        .status(403)
        .json({ message: "you don't have access to create an music" });
    }
  } catch (err) {
    return res.status(401).json({ message: "unautherized" });
  }

  const {title} = req.body;
  


}
