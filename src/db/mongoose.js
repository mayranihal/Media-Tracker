"use strict";
// DO NOT CHANGE THIS FILE
const mongoose = require("mongoose");

// DO NOT CHANGE THIS FILE
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/MyListDatabase",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }
);

console.log(process.env.MONGODB_URI);

// DO NOT CHANGE THIS FILE
module.exports = { mongoose };
