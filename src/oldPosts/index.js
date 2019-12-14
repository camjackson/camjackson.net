const fs = require('fs');

const posts = [
  { slug: '9-things-every-reactjs-beginner-should-know', posted: '24th January 2016', title: '9 things every React.js beginner should know' },
  { slug: 'server-side-rendering-with-react', posted: '24th December 2015', title: 'Server-Side Rendering with React' },
  { slug: 'rust-lang-how-to-pass-a-closure-into-a-trait-object', posted: '18th June 2015', title: 'Rust: Passing a closure to a trait object' },
];

module.exports = posts.map(({ slug, posted, title }) => {
  const text = fs.readFileSync(`./src/oldPosts/${slug}.md`, { encoding: 'utf8' });
  const blurb = text.substr(0, text.indexOf('[//]: # (fold)'));

  return { slug, title, posted, text, blurb };
});
