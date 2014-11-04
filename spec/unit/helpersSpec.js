var sinon = require('sinon');
var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
var expect = chai.expect;

var helpers = require('../../lib/helpers');

describe('helpers', function() {
  var sandbox;
  var result;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    result = {
      status: sandbox.spy(function(_) {return result;}),
      send: sandbox.spy(),
      render: sandbox.spy()
    };
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('bodyMethodOverrider', function() {
    it('returns nothing when the request has no body', function() {
      var method = helpers.bodyMethodOverrider({});
      expect(method).to.be.undefined;
    });

    it('returns nothing when the request body is not an object', function() {
      var method = helpers.bodyMethodOverrider({ body: 'body' });
      expect(method).to.be.undefined;
    });

    it('returns nothing when the request body object does not contain _method', function() {
      var method = helpers.bodyMethodOverrider({ body: {} });
      expect(method).to.be.undefined;
    });

    it('returns the given method when the request body does contain _method', function() {
      var method = helpers.bodyMethodOverrider({ body: {_method: 'patch'} });
      expect(method).to.equal('patch');
    });
  });

  describe('errorHandler', function() {
    it('renders a last resort error page with a failure status', function() {
      helpers.errorHandler(null, null, result);
      expect(result.status).to.have.been.calledWithExactly(500);
      expect(result.render).to.have.been.calledWithExactly('error.jade');
    })
  });

  describe('createResponder', function() {
    it('sends the supplied html with a success status when there are no errors', function() {
      helpers.createResponder(result)(null, 'some html');
      expect(result.status).to.have.been.calledWithExactly(200);
      expect(result.send).to.have.been.calledWithExactly('some html');
    });

    it('renders the error page with a failure status when there are errors', function() {
      helpers.createResponder(result)('some error', null);
      expect(result.status).to.have.been.calledWithExactly(500);
      expect(result.render).to.have.been.calledWithExactly('error.jade');
    });
  });
});
