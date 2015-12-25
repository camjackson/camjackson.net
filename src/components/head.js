'use strict';

const React = require('react');

const ie8Support = '<!--[if lt IE 9]>' +
  '<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>' +
  '<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>' +
  '<![endif]-->';

module.exports = () => (
  <head>
    <meta charSet="utf-8"/>
    <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css"
          integrity="sha512-dTfge/zgoMYpP7QbHy4gWMEGsbsdZeCXz7irItjcC3sPUFtf0kuFbDz/ixG7ArTxmDjLXDmezHubeNikyKGVyQ=="
          crossOrigin="anonymous"/>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css"/>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/highlight.js/8.6/styles/darkula.min.css" type="text/css"/>
    <meta name="ie8_support_plz_ignore" dangerouslySetInnerHTML={{__html: ie8Support}}></meta>

    <title>Cam Jackson</title>
    <link rel="icon" type="image/x-icon" href="/favicon.ico"/>
    <link href="/style.css" rel="stylesheet"/>
    <link href="/atom.xml" type="application/atom+xml" rel="alternate" title="Sitewide ATOM Feed" />
    <script type='text/javascript' src="ga.js"></script>
  </head>
);
