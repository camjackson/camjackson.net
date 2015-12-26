'use strict';

const React = require('react');
const Page = require('./page');

module.exports = () => (
  <Page>
    <div className="container">
      <div className="row">
        <div className="col-sm-2 col-sm-offset-5">
          <form id="login-form" method="post" action="/login/">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input type="text" className="form-control" id="username" name="username"/>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" className="form-control" id="password" name="password"/>
            </div>
            <input type="submit" className="btn btn-default" value="Log In"/>
          </form>
        </div>
      </div>
    </div>
  </Page>
);
