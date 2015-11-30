'use strict';

const React = require('react');

module.exports = () => (
  <div className="jumbotron">
    <div className="container">
      <div className="row">
        <div className="col-sm-7 col-sm-offset-1 col-sm-push-4
                        col-md-6 col-md-offset-2">
          <h1>Cam Jackson</h1>
          <h3>- Full stack developer</h3>
          <h3>- DevOps evangelist</h3>
          <h3>- Consultant</h3>
        </div>
        <div className="col-xs-6 col-xs-offset-3
                        col-sm-3 col-sm-offset-1 col-sm-pull-8 "
             style={{border: '1px solid grey', borderRadius: '10px', height: '260px', marginTop: '20px'}}>
        </div>
      </div>
    </div>
  </div>
);
