'use strict';
const log = require('./logging');
const dynasty = require('dynasty');
let db;

if (process.env.REMOTE_DB) {
  log.info('Connecting dynasty to AWS using access keys');
  db = dynasty({ accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY });
} else if (process.env.LOCAL_DB) {
  log.info('Connecting dynasty to localhost');
  db = dynasty({ accessKeyId: '-', secretAccessKey: '-' }, 'http://localhost:8000');
} else {
  log.info('Connecting dynasty to AWS using IAM');
  db = dynasty({});
}

exports.Posts = db.table('Posts');
exports.client = db.dynamo;
