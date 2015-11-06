'use strict';

let React = require('react');

class PostPreview extends React.Component {
  render() {
    return (
      <div className="col-md-6">
        <h3>{this.props.post.title}</h3>
        <p>
          {this.props.post.blurb}
          <a className="pull-right" href={this.props.post.slug}>Read more...</a>
        </p>
      </div>
    );
  }
}

module.exports = PostPreview;
