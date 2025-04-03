const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userScheema = mongoose.Schema({
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
});

userScheema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userScheema);
