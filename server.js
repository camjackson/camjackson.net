process.env.LOGGING = true;

require('./src/app').listen(process.env.PORT ||  8080);

console.log('App listening on 8080');
