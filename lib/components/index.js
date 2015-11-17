'use strict';

const React = require('react');
const Head = require('./head');
const NavBar = require('./navBar');
const Jumbo = require('./jumbo');
const LatestPosts = require('./latestPosts');
const SkillPanels = require('./skillPanels');

module.exports = (props) => (
  <html>
    <Head/>
    <body>
      <NavBar/>
      <Jumbo/>
      <LatestPosts posts={props.posts}/>
      <hr/>
      <SkillPanels/>
    </body>
  </html>
);
