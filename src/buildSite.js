const React = require('react');
const ReactDOMServer = require('react-dom/server');
const fs = require('fs-extra');
const mkdirp = require('mkdirp');

const oldPosts = require('./oldPosts');
const PostComponent = require('./oldPosts/components/post');

const out = 'target';

console.log('Creating output directories...')
mkdirp.sync(out);
mkdirp.sync(`${out}/post`);

oldPosts.forEach(post => {
  const path = `${out}/post/${post.slug}.html`;

  console.log(`Writing ${path}...`);
  fs.writeFileSync(
    path,
    ReactDOMServer.renderToStaticMarkup(<PostComponent post={post}/>)
  );
});

console.log('Copying newSite...');
fs.copySync('src/newSite', `${out}`);
