'use strict';

const React = require('react');

module.exports = () => (
  <section className="jumbotron">
    <div className="container">
      <div className="row">
        <div className="col-xs-10 col-xs-offset-1
                        col-sm-7 col-sm-offset-5
                        col-md-6 col-md-offset-6">
          <h1>Cam Jackson</h1>
        </div>
      </div>
      <div className="row">
        <div className="col-xs-6 col-xs-offset-1
                        col-sm-push-4
                        col-md-6 col-md-offset-2">
          <h3>- Full stack developer</h3>
          <h3>- DevOps evangelist</h3>
          <h3>- Consultant</h3>
        </div>
        <div className="col-xs-5
                        col-sm-3 col-sm-offset-1 col-sm-pull-7">
          <img src="profile.jpg" alt="Profile picture"/>
        </div>
      </div>
    </div>
  </section>
);
