const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uuid = require("uuid");
const User = require("../User/schema");

const IotSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    data: Array,
    trigger: String,
    safeCode: String,
    category: String,
    actionRoute: String,
    belongsTo: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

IotSchema.pre("save", function (next) {
  if (!this.safeCode) {
    this.safeCode = uuid.v4();
  }
  next();
});

module.exports = mongoose.model("IoT", IotSchema);
