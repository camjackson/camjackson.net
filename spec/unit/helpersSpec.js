var sinon = require('sinon');
var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
var expect = chai.expect;

var helpers = require('../../lib/helpers');

describe('helpers', function() {
  describe('responder', function() {
    var sandbox;
    var result;
    var responder;

    beforeEach(function() {
      sandbox = sinon.sandbox.create();
      result = {
        status: sandbox.spy(function(_) {return result;}),
        send: sandbox.spy(),
        render: sandbox.spy()
      };
      responder = helpers.createResponder(result);
    });

    afterEach(function() {
      sandbox.restore();
    });

    it('sends the supplied html with a success status when there are no errors', function() {
      responder(null, 'some html');
      expect(result.status).to.have.been.calledWithExactly(200);
      expect(result.send).to.have.been.calledWithExactly('some html');
    });

    it('renders the error page with a failure status when there are errors', function() {
      responder('some error', null);
      expect(result.status).to.have.been.calledWithExactly(500);
      expect(result.render).to.have.been.calledWithExactly('error.jade');
    });
  });
});
