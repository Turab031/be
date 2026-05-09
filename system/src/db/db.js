const mongoose = require("mongoose");

async function connectDb() {
  try {
    mongoose.connect(process.env.MONGO_URL);
    console.log("mongoose conntected");
  } catch (err) {
    console.log(err);
  }
}
module.exports = connectDb;
