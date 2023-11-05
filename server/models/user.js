const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const movieSchema = new mongoose.Schema({
  title: String,
  year: String,
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  watchlist: [movieSchema],
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

module.exports = User;