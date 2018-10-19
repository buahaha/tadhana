const express = require('express');
const bodyParser = require('body-parser');
const { Blog } = require('./models/shoutOutModel');

// create new Express app
var app = express();
// parse json
app.use(bodyParser.json());
// set port
const port = process.env.PORT || 3003;

// return all Blog posts
app.get('/', (req, res) => {
  Blog.find({}).sort({createdAt: 'descending'})
  .then(posts => {
    res.send(posts);
  }, e => {
    res.status(500).send({
      status: 500,
      message: e.message
    });
  });
});

// save new post
// use reCAPTCHA to protect against bots
app.post('/', (req, res) => {
  var post = new Blog({
    title: req.body.title,
    author: req.body.author,
    body: req.body.body
  });
  post.save()
  .then(savedPost => {
    res.send(savedPost);
  }, e => {
    res.status(500).send({
      status: 500,
      message: e.message
    });
  });
});

var server = app.listen(port, () => {

});

module.exports.server = server;