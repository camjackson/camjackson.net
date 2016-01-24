'use strict';

const React = require('react');
const Head = require('./head');
const NavBar = require('./navBar');
const Footer = require('./footer');

const PageComponent = (props) => (
  <html>
    <Head title={props.title} pageScripts={props.pageScripts}/>
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

PageComponent.propTypes = {
  title: React.PropTypes.string,
  pageScripts: React.PropTypes.arrayOf(React.PropTypes.string)
};

module.exports = PageComponent;
