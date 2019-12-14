const React = require('react');
const ReactDOMServer = require('react-dom/server');
const fs = require('fs-extra');
const mkdirp = require('mkdirp');

const posts = require('./posts');
const PostComponent = require('./components/post');

const out = 'target';

const write = (file, string) => {
  console.log(`Writing ${file}...`);
  fs.writeFileSync(`${out}/${file}`, string);
}

const render = (file, component) => {
  write(file, ReactDOMServer.renderToStaticMarkup(component))
};

console.log('Creating output directories...')
mkdirp.sync(out);
mkdirp.sync(`${out}/post`);

posts.forEach(post => (
  render(`post/${post.slug}.html`, <PostComponent post={post}/>)
));

console.log('Copying newSite...');
fs.copySync('src/newSite', `${out}`);
