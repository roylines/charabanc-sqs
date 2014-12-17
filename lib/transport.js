var _ = require('lodash'),
  registry = require('./registry'),
  async = require('async');

var transport = {};

transport.configure = function(config, done) {
  done = done || _.noop;
  return done();
};

transport.register = function(action, service, done) {
  done = done || _.noop;
  return registry.add(action, service, done);
};

transport.unregister = function(action, service, done) {
  done = done || _.noop;
  return registry.remove(action, service, done);
};

transport.request = function(action, payload, done) {
  done = done || _.noop;
  return registry.get(action, function(e, services) {
    if (e) {
      return done(e);
    }

    var actions = _.map(services, function(service) {
      return function(cb) {
        return service(action, _.clone(payload, true), cb);
      };
    });

    function complete(e, results) {
      var o = {
      };
      _.each(results, function(r) {
        o = _.merge(o, r);
      });
      return done(e, o);
    };

    return async.parallel(actions, complete);
  });
};

transport.reset = function(done) {
  return registry.reset(done);
};

transport.dump = function(done) {
  return registry.dump(done); 
};

module.exports = transport;
