const mongoose = require("mongoose");

const UserSceema = mongoose.Schema({
  firstname: { type: String, require: true },
  lastname: { type: String, require: true },
  city: { type: String, require: true },
  contactnumber: { type: String, require: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },
  item: { type: String, require: true },
});

module.exports = mongoose.model("Ragisteruser", UserSceema);
