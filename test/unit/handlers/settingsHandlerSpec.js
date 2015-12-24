'use strict';
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const expect = chai.expect;
const Q = require('q');

const SettingsHandler = require('../../../src/handlers/settingsHandler').SettingsHandler;
const helpers = require('../../../src/helpers');

describe('SettingsHandler', function() {
  let sandbox;
  let response;
  const settingsHandler = new SettingsHandler(function(){return 'a responder';});

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
      const request = { flash: sandbox.stub().withArgs('errorMessage').returns('some error') };
      settingsHandler.getSettings(request, response);

      expect(response.render).to.have.been.calledWith(
        'pages/settings.jade',
        { config: 'the config', errorMessage: 'some error' },
        'a responder'
      );
    });
  });
});
