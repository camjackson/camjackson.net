const fs = require('fs');

const posts = [
  { file: '2016-01-24_9-things-every-reactjs-beginner-should-know.md', title: '9 things every React.js beginner should know' },
  { file: '2015-12-24_server-side-rendering-with-react.md', title: 'Server-Side Rendering with React' },
  { file: '2015-06-18_rust-lang-how-to-pass-a-closure-into-a-trait-object.md', title: 'Rust: Passing a closure to a trait object' },
];

module.exports = posts.map(post => {
  const [posted, slug] = post.file.slice(0, -3).split('_');
  const title = post.title;
  const text = fs.readFileSync(`./src/posts/${post.file}`, { encoding: 'utf8' });
  const blurb = text.substr(0, text.indexOf('[//]: # (fold)'));

  return { slug, title, posted, text, blurb };
});
