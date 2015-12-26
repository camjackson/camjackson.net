'use strict';

const React = require('react');
const Page = require('./page');
const Jumbo = require('./jumbo');
const LatestPosts = require('./latestPosts');
const SkillPanels = require('./skillPanels');

const IndexComponent = (props) => (
  <Page>
    <Jumbo/>
    <LatestPosts posts={props.posts}/>
    <hr/>
    <SkillPanels/>
  </Page>
);

IndexComponent.propTypes = {
  posts: React.PropTypes.arrayOf(React.PropTypes.object)
};

module.exports = IndexComponent;
