'use strict';

const React = require('react');
const Page = require('./page');
const Jumbo = require('./jumbo');
const LatestPosts = require('./latestPosts');
const SkillPanels = require('./skillPanels');

module.exports = (props) => (
  <Page>
    <Jumbo/>
    <LatestPosts posts={props.posts}/>
    <hr/>
    <SkillPanels/>
  </Page>
);
