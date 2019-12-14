const React = require('react');
const ReactDOMServer = require('react-dom/server');
const fs = require('fs-extra');

const oldPosts = require('./src/post');
const PostComponent = require('./src/post/components/post');

oldPosts.forEach(post => {
  const path = `src/post/${post.slug}.html`;

  console.log(`Writing ${path}...`);
  fs.writeFileSync(
    path,
    ReactDOMServer.renderToStaticMarkup(<PostComponent post={post}/>)
  );
});
