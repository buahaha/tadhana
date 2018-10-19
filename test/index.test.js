const chai = require('chai')
const request = require('supertest');
const mongoose = require('mongoose');

const assert = chai.assert;

describe('Tadhana', () => {
  // load app
  var app = require('../index').server;
  var { Blog } = require('../models/shoutOutModel');

  // create some posts
  before(async function(done) {
    this.timeout(10000);
    const { mongo_test_url } = require('../secrets/mongodb');
    mongoose.connect(mongo_test_url, {
      useNewUrlParser: true,
      useCreateIndex: true,
    });
    // change expire to 10 seconds
    [1, 2, 3, 4, 5].forEach(async body => {
      await new Blog({body: body}).save()
      .then(doc => {
        // intentionally left blank
      }, e => {
        done(e);
      });
    });
    done();
  })

  after(done => {
    app.close();
    mongoose.disconnect();
    done();
  })

  it('should connect to app', done => {
    request(app)
    .get('/')
    .expect(200)
    .end((err, res) => {
      if (err) return done(err);
      done()
    });
  });

  it('should get posts from database', done => {
    request(app)
    .get('/')
    .expect(res => {
      assert.isArray(res.body, 'response is array');
      assert.isNotEmpty(res.body, 'array is not empty');
      res.body.forEach(blog => {
        assert.hasAllKeys(blog, 
          ['title', 'author', 'body', 'createdAt', '_id', '__v'],
          'blog post has all keys');
      });
    })
    .expect(200)
    .end((err, res) => {
      if (err) return done(err);
      done();
    });
  });

  it('should save shout out to database', done => {
    request(app)
    .post('/')
    .send({
      body: 'Saving test'
    })
    .expect(res => {
      assert.hasAllKeys(res.body,
        ['title', 'author', 'body', 'createdAt', '_id', '__v'],
        'returned blog post has all keys');
    })
    .end((err, res) => {
      if (err) return done(err);
      Blog.findById(res.body._id)
      .then(doc => {
        assert.equal(doc.body, 'Saving test', 
          'successfully saved to database');
      }, e => {
        done(e);
      })
      .then(() => {
        done();
      });
    });
  });
});