var charabanc = require('charabanc'),
  chai = require('chai'),
  sinon = require('sinon'),
  t = require('../lib/transport');

chai.should();

describe('transport', function() {
  before(function() {
    charabanc.setTransport(t);
  });

  it('can call configure', function(done) {
    return charabanc.configure({}, done);
  });

  describe('with one service', function() {
    var service;
    before(function(done) {
      service = sinon.stub();
      service.yields(null, { response: 'RESPONSE' });
      return charabanc.register('act', service, done);
    });
    after(function(done) {
      return charabanc.reset(done);
    });
    it('should call service', function(done) {
      charabanc.request('act', {
        payload: 'PAYLOAD'
      }, function(e, response) {
        response.should.deep.equal({ response: 'RESPONSE' });
        return done(e);
      });
    });
  });
});
