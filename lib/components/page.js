'use strict';

const React = require('react');
const Head = require('./head');
const NavBar = require('./navBar');
const Footer = require('./footer');

module.exports = (props) => (
  <html>
    <Head/>
    <body>
      <NavBar/>
      {props.children}
      <Footer/>
    </body>
  </html>
);
