'use strict';

const React = require('react');
const Page = require('./page');

module.exports = () => (
  <Page>
    <div className="container">
      <div className="row">
        <div className="col-sm-4 col-sm-offset-4">
          <h2>Invalid Google account</h2>
          <p>
            Your current Google account is not authorised for this site.
          </p>
          <p>
            Perhaps <a href="https://accounts.google.com/logout" target="_blank">log out of Google</a> and try again?
          </p>
          <p>
            Or if you are logged into multiple Google accounts, you may have just selected the wrong one.
          </p>
          <p>
            <a href="/login">Click here</a> to try again.
          </p>
        </div>
      </div>
    </div>
  </Page>
);
