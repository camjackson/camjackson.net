'use strict';

let React = require('react');

class Head extends React.Component {
  render() {
    let ie8Support = '<!--[if lt IE 9]>' +
      '<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>' +
      '<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>' +
      '<![endif]-->';

    return (
      <head>
        <meta charSet="utf-8"/>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css"
              integrity="sha512-dTfge/zgoMYpP7QbHy4gWMEGsbsdZeCXz7irItjcC3sPUFtf0kuFbDz/ixG7ArTxmDjLXDmezHubeNikyKGVyQ=="
              crossOrigin="anonymous"/>
        <meta name="ie8_support_plz_ignore" dangerouslySetInnerHTML={{__html: ie8Support}}></meta>

        <title>Cam Jackson</title>
        <link href="/style.css" rel="stylesheet"/>
      </head>
    );
  }
}

module.exports = Head;
