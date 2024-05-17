//config.js
const mongoose = require("mongoose");
const LoginSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    min: 3,
    max: 20,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 6,
  },
});

const collection = new mongoose.model("users2", LoginSchema);

module.exports = collection;
