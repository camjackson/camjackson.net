'use strict';

let React = require('react');

class NavBar extends React.Component {
  render() {
    return (
      <nav className="navbar navbar-fixed-top navbar-inverse">
        <div className="container">
          <a className="navbar-brand navbar-right" href="/">camjackson.net</a>
        </div>
      </nav>
    );
  }
}

module.exports = NavBar;
