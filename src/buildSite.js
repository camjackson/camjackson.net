const React = require('react');
const ReactDOMServer = require('react-dom/server');
const fs = require('fs-extra');
const mkdirp = require('mkdirp');

const posts = require('./posts');
const IndexComponent = require('./components/index');
const ArchiveComponent = require('./components/archive');
const PostComponent = require('./components/post');
const renderAtomFeed = require('./renderAtomFeed');

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

const firstTwoPosts = posts.slice(0, 2);
render('index.html', <IndexComponent posts={firstTwoPosts}/>);
render('archive.html', <ArchiveComponent posts={posts}/>);
posts.forEach(post => (
  render(`post/${post.slug}.html`, <PostComponent post={post}/>)
));
write('atom.xml', renderAtomFeed(posts));

console.log('Copying newSite...');
fs.copySync('src/newSite', `${out}/newSite`);

console.log('Copying public...');
fs.copySync('public', `${out}/public`);

// TODO: Headers: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/example-functions.html
// TODO: Error page
