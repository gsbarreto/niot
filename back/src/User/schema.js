const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: String,
    email: String,
    password: String,
    iots: [{ type: Schema.Types.ObjectId, ref: "IoT" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
