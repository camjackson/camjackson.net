Over the last 6 months I've been using [React](https://facebook.github.io/react/) in a single page app project, and
I've fallen in love with it. Of course, a big part of what makes React great is the magic it does in the browser with
its Virtual DOM, but even for simple static pages it has some properties that make it ideal for server-side rendering:

[//]: # (fold)

1. **Familiar syntax:** Compared with templating languages like [Jade](http://jade-lang.com/) or
[Handlebars](http://handlebarsjs.com/), there's almost no new syntax or API to learn (assuming you use
[JSX](https://facebook.github.io/jsx/), which you absolutely should!). It's just HTML and Javascript with some minor
differences.
2. **Easy component composition:** HTML by nature is about putting bits together to build something larger, and React
extends that by encouraging you to build small components that can be pieced together, and often reused on multiple
pages.
3. **UI as functions:** React components, written well, are really just functions that spit out some HTML based on
input parameters. These stateless, pure, functional components are testable and predictable - given a certain set of
properties, we know exactly what our page will look like.

It's important to remember that React isn't an MVC framework, it's a just view library. So if you're already writing a
[Node.js](https://nodejs.org/) app where it makes sense to render pages on the server, React is a great option. Let's
take a look at the code to render this page:

```js
const React = require('react');
const ReactDomServer = require('react-dom/server');
const PostComponent = require('./components/PostComponent');

app.get('/post/:slug', (req, res) => {
  const relevantPost = getPostFromDatabase(req.params.slug);
  const html = ReactDOMServer.renderToStaticMarkup(<PostComponent post={relevantPost}/>);
  res.send(html);
});
```
I've removed some boilerplate and simplified the database code, but the important bits are all there. Let's look more
closely at the bit that looks kinda like html:

```js
<PostComponent post={relevantPost}/>
```

This is called JSX, and it compiles down to a Javascript function call which basically says "instantiate the React
component called `PostComponent`, passing in `relevantPost` as the value for the `post` prop". Prop values can either be
strings, just like HTML, or as above, Javascript expressions inside curly brackets. The resulting component is then
rendered to static markup, and sent back as a response.

Let's take a look at the component:

```js
const React = require('react');
const moment = require('moment');
const Page = require('./page');

const PostComponent = (props) => (
  <Page>
    <article className="container post">
      <h1>{props.post.title}</h1>
      <time pubdate className="pull-right">
        <em>{moment(props.post.posted).format('Do MMMM YYYY')}</em>
      </time>
      <hr/>
      <div>{props.post.text}</div>
    </article>
  </Page>
);
module.exports = PostComponent;
```
There are a few things worth calling out here:
1. The export (i.e. our component) is just a function, which takes props and returns some JSX.
2. The `props` parameter is an object with all of the attributes assigned to this element. In this case it's `{post: {relevantPost}}`
3. This component is composed partly out of another custom react component ( the capitalised `Page`), but mostly regular
HTML elements (all the lowercase ones).
4. In JSX we use `className` instead of `class`, because the latter is a Javascript reserved word.
5. We can use awesome Javascript libraries like [moment.js](http://momentjs.com/) from within our components. More on that later.

That `Page` component is actually common code used by all of the pages on this site. Here's what it looks like:

```js
const React = require('react');
const Head = require('./head');
const NavBar = require('./navBar');
const Footer = require('./footer');

const Page = (props) => (
  <html>
    <Head/>
    <body>
      <div id="container">
        <NavBar/>
        <main>
          {props.children}
        </main>
        <Footer/>
      </div>
    </body>
  </html>
);

module.exports = Page;
```

You can tell that it's the root component, laying out the head, body, nav and footer elements that every page needs.
The only new concept here is the special prop called `children`, which refers to any elements that are placed between
the opening and closing `<Page>` tags. In this example, we're taking the `<article>` element (and all its children) and
putting it inside the `<main>` tag. Easy!

That's pretty much all there is to it. We write some React components, compose them together, pass them to a special
render method, and send it back! The only thing missing from this equation is testing, but that's a whole separate blog
post :)

### Advanced topic: rendering markdown

I have to admit, I told a small lie earlier, specifically this line:

```js
<div>{props.post.text}</div>
```

Actually, I write and store my blog posts in [markdown](https://daringfireball.net/projects/markdown/syntax) format, and
render to HTML using [marked](https://github.com/chjj/marked) and [highlight.js](https://highlightjs.org/). So the
expression `props.post.text` isn't quite what we want. Even if we passed in the already-rendered html, it still wouldn't
work as is, because React won't let you inject HTML quite so easily. The actual code I use looks like this:

```js
<div dangerouslySetInnerHTML={{__html: marked(props.post.text)}}></div>
```

The post text is passed to `marked` for rendering, which returns raw HTML. However, we can't just use it as a child
element of the div. Instead, React makes us use the `dangerouslySetInnerHTML` prop. The value that we have to pass is an
object with a single `__html` field, which we set to the actual HTML we want to inject.

I actually think this is a really good compromise. This kind of behaviour (injecting arbitrary HTML into your React
component) is clearly not the intended way to use React. However, because there's a legitimate use case for it, the
React developers have given us a perfectly workable solution; the only price we have to pay is a slightly ugly
signature, and an acknowledgement that what we're doing is a bit dirty, and potentially unsafe.

If you want to see the full code for my site, including more server-side React examples, click the link in the footer.

Happy Reacting!
