'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {type: String, unique: true},
  password: {type: String, set: string => (bcrypt.hashSync(string, 8))}
});

exports.User = mongoose.model('User', userSchema);
