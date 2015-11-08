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
          <h3>- Serial automator</h3>
          <h3>- Consultant</h3>
          <span>
            <a href="https://github.com/camjackson"><i className="fa fa-3x fa-github"/></a>
            <a href="https://twitter.com/camjackson89"><i className="fa fa-3x fa-twitter"/></a>
            <a href="https://linkedin.com/pub/cam-jackson/30/60a/192"><i className="fa fa-3x fa-linkedin"/></a>
          </span>
        </div>
        <div className="col-xs-6 col-xs-offset-3
                            col-sm-3 col-sm-offset-1 col-sm-pull-8 "
             style={{border: '1px solid grey', borderRadius: '10px', height: '260px', marginTop: '20px'}}>
        </div>
      </div>
    </div>
  </div>
);
