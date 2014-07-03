var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var commentSchema = new Schema({
  author: String,
  text: String,
  posted: { type: Date, default: Date.now }
});

var postSchema = new Schema({
  title: String,
  text: String,
  visible: { type: Boolean, default: false },
  authorId: ObjectId,
  posted: { type: Date, default: Date.now },
  edited: { type: Date, default: Date.now },
  comments: [commentSchema]
});
exports.Post = mongoose.model('Post', postSchema);