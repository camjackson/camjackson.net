writeitdown
===========
[![Build Status](https://snap-ci.com/camjackson/writeitdown/branch/master/build_image)](https://snap-ci.com/camjackson/writeitdown/branch/master)

Blogging with markdown, complete with code highlighting!

For a demo, see [camjackson.net](http://camjackson.net)

Dependencies:

1. node.js
2. npm
3. gulp
4. mongodb

To run the tests:

1. mongod
2. npm install
3. gulp test

To run the app:

1. mongodb
2. gulp seed (seeds localhost by default, override with DB_CONNECTION_STRING environment variable)
3. npm start

Default login is admin/admin
