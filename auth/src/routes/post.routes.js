const express = require("express");
const router = express.Router();

router.post("/create", (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    res.send(401).json({
      message: "unautheriresd",
    });
  }
  res.send("post created");
});
module.exports = router;
