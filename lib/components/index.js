'use strict';

let React = require('react');
let Head = require('./head');
let NavBar = require('./navBar');
let Jumbo = require('./jumbo');
let LatestPosts = require('./latestPosts');
let SkillPanels = require('./skillPanels');

class Index extends React.Component {
  render() {
    return (
      <html>
        <Head/>
        <body>
          <NavBar/>
          <Jumbo/>
          <LatestPosts/>
          <hr/>
          <SkillPanels/>
        </body>
      </html>
    );
  }
}

module.exports = Index;
