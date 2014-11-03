var sinon = require('sinon');
var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
var expect = chai.expect;

var AuthHandler = require('../../../lib/handlers/authHandler').AuthHandler;
var Config = require('../../../lib/models').Config;

describe('AuthHandler', function() {
  var sandbox;
  var result;
  var createResponder = function(){return 'a responder';};

  before(function() {
    sandbox = sinon.sandbox.create();
    sandbox.stub(Config, 'findOne').returns('config');
    result = { render: sandbox.spy() }
  });

  after(function() {
    sandbox.restore();
  });

  describe('getLogin', function() {
    it('sends the login page with correct data', function() {
      var reqWithFlash = {flash: function () {return ['some auth error']}};
      new AuthHandler(createResponder).getLogin(reqWithFlash, result);
      expect(result.render).to.have.been.calledWith(
        'login.jade',
        { config: 'config', errorMessage: 'some auth error' },
        'a responder'
      );
    });
  });

  describe('authenticate', function() {
    //TODO!
  });
});
