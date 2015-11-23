[camjackson.net](http://camjackson.net)
===========
[![Build Status](https://snap-ci.com/camjackson/camjackson.net/branch/master/build_image)](https://snap-ci.com/camjackson/camjackson.net/branch/master)

My personal website. Includes a landing page with bio/skills, and blogging with markdown, complete with code highlighting!

### Dependencies:

1. node.js + npm
2. mongodb

### Setup
1. `npm install`
2. Start `mongod` in a separate terminal.
3. `bin/seed` (seeds localhost by default, override with env DB_CONNECTION_STRING)

### Tests:
`npm test`

### Run:
`npm start`

Default login is admin/admin
