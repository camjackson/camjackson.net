var sinon = require('sinon');
var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
var expect = chai.expect;
var Q = require('q');

var SettingsHandler = require('../../../lib/handlers/settingsHandler').SettingsHandler;
var helpers = require('../../../lib/helpers');
var Profile = require('../../../lib/models').Profile;

describe('SettingsHandler', function() {
  var sandbox;
  var response;
  var settingsHandler = new SettingsHandler(function(){return 'a responder';});

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    sandbox.stub(helpers, 'getEnvConfig').returns('the config');
    response = { render: sandbox.spy(), redirect: sandbox.spy() };
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('getSettings', function() {
    it('renders the settings page with the correct data', function() {
      var request = { flash: sandbox.stub().withArgs('errorMessage').returns('some error') };
      settingsHandler.getSettings(request, response);

      expect(response.render).to.have.been.calledWith(
        'pages/settings.jade',
        { config: 'the config', errorMessage: 'some error' },
        'a responder'
      );
    });

    it('updates or creates the user profile and redirects to the settings page', function() {
      var promise = Q.fcall(function () {});
      sandbox.stub(Profile, 'findOneAndUpdate').returns({ exec: function() {return promise;} });

      var request = { body: { profileImage: 'an image', profileText: 'some text' } };
      return settingsHandler.updateSettings(request, response).then(function() {
        expect(Profile.findOneAndUpdate).to.have.been.calledWithExactly({}, {
          text: 'some text',
          image: 'an image'
        }, { upsert: true });
        expect(response.redirect).to.have.been.calledWithExactly(303, 'settings')
      });
    });
  });
});
