'use strict';

const React = require('react');
const Head = require('./head');
const NavBar = require('./navBar');
const Footer = require('./footer');

module.exports = (props) => (
  <html>
    <Head/>
    <body>
      <div id="container">
        <NavBar/>
        <div id="main-content">
          {props.children}
        </div>
        <Footer/>
      </div>
    </body>
  </html>
);
