require('mongoose').connect(process.env.MONGOLAB_URI || 'mongodb://localhost/camjackson-net');

process.env.LOGGING = true;
const log = require('./src/logging').logger;

const app = require('./src/app');

log.info('Starting app...');
app.listen(process.env.PORT ||  8080);
log.info('App listening on 8080');
