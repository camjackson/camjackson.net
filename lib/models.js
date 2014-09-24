var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var postSchema = new mongoose.Schema({
  title: String,
  text: String,
  slug: String,
  posted: { type: Date, default: Date.now }
});

var configSchema = new mongoose.Schema({
  title: String,
  heading: String,
  domain: String
});

exports.Post = mongoose.model('Post', postSchema);
exports.Config = mongoose.model('Config', configSchema);
