const mongoose = require("mongoose");

async function connectDB() {
  await mongoose.connect("mongodb://127.0.0.1:27017/sher");
  console.log("mongoose connected");
}
module.exports = connectDB;
