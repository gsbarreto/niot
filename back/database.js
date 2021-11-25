const mongoose = require("mongoose");
const User = require("./src/User/schema");
const IoT = require("./src/IoT/schema");

mongoose.connect(process.env.DATABASE_URL);

module.exports = { Mongoose: mongoose, User, IoT };
