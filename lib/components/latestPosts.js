'use strict';

let React = require('react');
let PostPreview = require('./postPreview');

class LatestPosts extends React.Component {
  constructor() {
    super();
    this.state = {
      posts: [
        {
          title: 'Rust lang: How to pass a closure into a trait object',
          slug: '/post/rust-lang-how-to-pass-a-closure-into-a-trait-object',
          blurb: '"I have an object which is a &SomeTrait, and I want to create a closure and pass it into a method on that trait. How do I make the types work?"' +
          'In this post I\'m going to go through my process of eventually figuring out the answer to this question, starting with a much simpler problem. If you just want the answer, then scroll right to the bottom of this post. Otherwise, read on!'
        },
        {
          title: 'Take it away and see',
          slug: '/post/take-it-away',
          blurb: 'A project manager friend recently revealed to me their one rebellious streak - not writing reports.' +
          ' Working at a company where standard (and expected) practice was to provide x number of reports to y number' +
          ' of people, every single iteration, this PM was convinced that most of them went totally unread, and so' +
          ' writing them was both a waste of time, and adding noise.'
        }
      ]
    };
  }

  postPreviews() {
    return this.state.posts.map((post) => {
      return <PostPreview key={post.slug} post={post}/>
    });
  }

  render() {
    return (
      <div className="container">
        <div className="row"><h1>Latest posts</h1></div>
        <div className="row">
          {this.postPreviews()}
        </div>
      </div>
    );
  }
}

module.exports = LatestPosts;
