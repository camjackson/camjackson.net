var sinon = require('sinon');
var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
var expect = chai.expect;

var marked = require('marked');

var SettingsHandler = require('../../../lib/handlers/settingsHandler').SettingsHandler;
var helpers = require('../../../lib/helpers');

describe('SettingsHandler', function() {
  var sandbox;
  var response;
  var settingsHandler = new SettingsHandler(function () {
    return 'a responder';
  });

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    sandbox.stub(helpers, 'getEnvConfig').returns('the config');
    response = {
      render: sandbox.spy()
    };
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('getSettings', function () {
    it('renders the settings page with the correct data', function () {
      var request = { flash: sandbox.stub().withArgs('errorMessage').returns('some error') };
      settingsHandler.getSettings(request, response);

      expect(response.render).to.have.been.calledWith(
        'settings.jade',
        { marked: marked, config: 'the config', errorMessage: 'some error' },
        'a responder'
      );
    });
  });
});
