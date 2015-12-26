'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {type: String, unique: true},
  password: {type: String, set: string => (bcrypt.hashSync(string, 8))}
});

const postSchema = new mongoose.Schema({
  title: String,
  slug: {type: String, unique: true},
  text: String,
  posted: Date
});

exports.User = mongoose.model('User', userSchema);
exports.Post = mongoose.model('Post', postSchema);
