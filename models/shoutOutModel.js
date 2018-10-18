const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// no comments as they might obstruct the law
// delete after 1 hour to comply with EU proposed law
var blogSchema = new Schema({
  title:  { type: String, default: 'Lots of lulz', minlength: 1, trim: true },
  author: { type: String, default: 'Anonymous', minlength: 1, trim: true },
  body:   { type: String, required: true, minlength: 1, trim: true },
  createdAt: { type: Date, default: Date.now, expires: 60 },
});

var Blog = mongoose.model('Blog', blogSchema);

module.exports.Blog = Blog;