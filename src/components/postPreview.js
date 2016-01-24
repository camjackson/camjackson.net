'use strict';

const React = require('react');
const moment = require('moment');
const marked = require('marked');
const highlightjs = require('highlight.js');

marked.setOptions({
  highlight: (code) => {
    return highlightjs.highlightAuto(code).value;
  }
});

const PostPreviewComponent = (props) => (
  <article className="col-md-6">
    <h3><a href={`/post/${props.post.slug}`}>{props.post.title}</a></h3>
    <time pubdate><em>{moment(props.post.posted).format('Do MMMM YYYY')}</em></time>
    <div>
      <span dangerouslySetInnerHTML={{__html: marked(props.post.blurb)}}/>
      <a className="pull-right" href={`/post/${props.post.slug}`}>Read more...</a>
    </div>
  </article>
);

PostPreviewComponent.propTypes = {
  post: React.PropTypes.shape({
    title: React.PropTypes.string,
    slug: React.PropTypes.string,
    blurb: React.PropTypes.string,
    posted: React.PropTypes.string
  })
};

module.exports = PostPreviewComponent;
