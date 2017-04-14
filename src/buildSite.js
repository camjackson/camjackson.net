const React = require('react');
const ReactDOMServer = require('react-dom/server');
const fs = require('fs');
const mkdirp = require('mkdirp');

const posts = require('./posts');
const IndexComponent = require('./components/index');
const ArchiveComponent = require('./components/archive');
const PostComponent = require('./components/post');

const out = 'target';

const render = (file, component) => {
  console.log(`Rendering ${file}...`)
  fs.writeFileSync(`${out}/${file}`, ReactDOMServer.renderToStaticMarkup(component))
};

console.log('Creating output directories...')
mkdirp(out);
mkdirp(`${out}/post`);

const firstTwoPosts = posts.slice(0, 2);
render('index.html', <IndexComponent posts={firstTwoPosts}/>);
render('archive.html', <ArchiveComponent posts={posts}/>);
posts.forEach(post => (
  render(`post/${post.slug}.html`, <PostComponent post={post}/>)
));
