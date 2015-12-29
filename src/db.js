'use strict';
const dynasty = require('dynasty');
let db;

if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  console.log('Connecting dynasty to AWS');
  db = dynasty({ accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY });
} else {
  console.log('Connecting dynasty to localhost');
  db = dynasty({ accessKeyId: '-', secretAccessKey: '-' }, 'http://localhost:8000');
}

exports.Posts = db.table('Posts');
