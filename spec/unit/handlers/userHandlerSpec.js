var sinon = require('sinon');
var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
var expect = chai.expect;

var marked = require('marked');

var UserHandler = require('../../../lib/handlers/userHandler').UserHandler;
var Config = require('../../../lib/models').Config;

describe('UserHandler', function() {
  var sandbox;
  var result;
  var userHandler = new UserHandler(function(){return 'a responder';});

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    sandbox.stub(Config, 'findOne').returns('the config');
    result = { render: sandbox.spy() };
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('getProfile', function() {
    it('renders the profile page with the correct data', function() {
      userHandler.getProfile(null, result);

      expect(result.render).to.have.been.calledWith(
        'profile.jade',
        { marked: marked, config: 'the config' },
        'a responder'
      );
    });
  });
});
