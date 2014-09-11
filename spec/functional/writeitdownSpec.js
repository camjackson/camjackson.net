//var http = require('http');
//
//var options = {
//  host: 'localhost',
//  port: 8080,
//  path: '/foo/index.html',
//  method: 'get',
//  headers: 'blah',
//
//};
//
//var request = http.request(options, function(res) {
//  console.log('STATUS: ' + res.statusCode);
//  console.log('HEADERS: ' + JSON.stringify(res.headers));
//  res.setEncoding('utf8');
//  res.on('data', function(chunk){
//    //do something with chunk
//  });
//});
//
//request.on("error", function(e){
//  console.log("Got error: " + e.message);
//});
//
//request.write('body line 1');
//request.write('body line 2');
//
//request.end();