const fs = require('fs');

const posts = [
  { file: '2014-11-14_hello-world.md', title: 'Hello, World!' },
  { file: '2014-11-15_hooray-for-cd.md', title: 'Hooray for Continuous Delivery!' },
  { file: '2014-12-20_yow-2014-day-1.md', title: 'Highlights from Yow! 2014 - Day 1' },
  { file: '2014-12-27_bug-fixes-for-christmas.md', title: 'Bug Fixes for Christmas' },
  { file: '2015-01-29_yow-2014-day-2.md', title: 'Highlights from Yow! 2014 - Day 2' },
  { file: '2015-05-04_take-it-away.md', title: 'Take it away and see' },
  { file: '2015-06-18_rust-lang-how-to-pass-a-closure-into-a-trait-object.md', title: 'Rust: Passing a closure to a trait object' },
  { file: '2015-12-24_server-side-rendering-with-react.md', title: 'Server-Side Rendering with React' },
  { file: '2016-01-24_9-things-every-reactjs-beginner-should-know.md', title: '9 things every React.js beginner should know' },
];

module.exports = posts.map(post => {
  const [posted, slug] = post.file.slice(0, -3).split('_');
  const title = post.title;
  const text = fs.readFileSync(`./src/posts/${post.file}`, { encoding: 'utf8' });
  const blurb = text.substr(0, text.indexOf('[//]: # (fold)'));

  return { slug, title, posted, text, blurb };
});
