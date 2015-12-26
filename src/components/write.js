'use strict';

const React = require('react');
const Page = require('./page');

const WriteComponent = (props) => (
  <Page pageScripts={['/script/marked.min.js', '/script/highlight.min.js', "/script/write.js"]}>
    <div className="container">
      <form className="form-horizontal" method="post" action="/posts/">
        <div className="form-group form-group-lg">
          <label className="col-sm-2 control-label" htmlFor="title">Post title:</label>
          <div className="col-sm-4">
            <input className="form-control" type="text"id="title" name="title" defaultValue={props.post.title}/>
          </div>
        </div>
        <div className="form-group">
          <label className="col-sm-2 control-label" htmlFor="slug">camjackson.net/</label>
          <div className="col-sm-3">
            <input className="form-control" type="text"id="slug" name="slug" defaultValue={props.post.slug} readOnly={props.post.slug}/>
          </div>
        </div>
        <div className="form-group">
          <textarea className="form-control" id="text" name="text" rows="20" defaultValue={props.post.text}/>
        </div>
        <div id="post-preview"></div>
        <input type="hidden" name="_method" value="PUT"/>
        <input type="submit" className="btn btn-default" value="Post"/>
      </form>
    </div>
  </Page>
);

WriteComponent.propTypes = {
  post: React.PropTypes.shape({
    title: React.PropTypes.string,
    slug: React.PropTypes.string,
    text: React.PropTypes.string
  }).isRequired
};

module.exports = WriteComponent;
