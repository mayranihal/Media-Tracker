/* User Models */
// DO NOT CHANGE THIS FILE

const mongoose = require("mongoose");

// const MediaDataSchema = new mongoose.Schema({
//   media: Object,
// });

//  Media Data will be embedded in the User model
const User = mongoose.model("User", {
  username: { type: String, required: true, minlength: 1 },
  password: { type: String, required: true, minlength: 1 },
  userType: { type: String, enum: ["user", "admin"] },
  //used this link to restrict usertype input for db to specific values:
  //https://stackoverflow.com/questions/29859910/restrict-mongoose-field-values
  color: { type: String, required: true, default: "black" },
  bio: {
    type: String,
    required: true,
    maxlength: 200,
    default: "Add Bio Here",
  },
  link: { type: String, required: true, default: "Add Website Link" },
  discordName: { type: String, required: true, default: "Add Discord Name" },
  isBanned: { type: Boolean, required: true, default: false },
  pic: {
    type: String,
    required: true,
    default:
      "https://media.discordapp.net/attachments/787082973907648563/829096768926384238/pexels-photo-1831234.png",
  },
  data: {},
});

module.exports = { User };
