'use strict';

let should = require('should');
let app = require('../../app');
let request = require('supertest');

describe('GET /api/qrcodes', function() {

  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/qrcodes')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });
});
