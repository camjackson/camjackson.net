const fs = require('fs');

const posts = [
  { file: '2016-01-24_9-things-every-reactjs-beginner-should-know.md', posted: '24th January 2016', title: '9 things every React.js beginner should know' },
  { file: '2015-12-24_server-side-rendering-with-react.md', posted: '24th December 2015', title: 'Server-Side Rendering with React' },
  { file: '2015-06-18_rust-lang-how-to-pass-a-closure-into-a-trait-object.md', posted: '18th June 2015', title: 'Rust: Passing a closure to a trait object' },
];

module.exports = posts.map(({ posted, title, file }) => {
  const [_, slug] = file.slice(0, -3).split('_');
  const text = fs.readFileSync(`./src/posts/${file}`, { encoding: 'utf8' });
  const blurb = text.substr(0, text.indexOf('[//]: # (fold)'));

  return { slug, title, posted, text, blurb };
});
