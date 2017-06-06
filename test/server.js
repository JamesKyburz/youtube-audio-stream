var http = require('http')
var fs = require('fs')
var stream = require('..')
var path = require('path')

http.createServer(demo).listen(3000)
  .on('error', function (err) {
    console.log(err);
  });

function demo(req, res) {
  if (req.url === '/') {
    return fs.createReadStream(path.join(__dirname, '/server.html')).pipe(res)
  }
  if (/youtube/.test(req.url)) {
    stream(req.url.slice(1), {response: res});
  }
}

console.log('open http://localhost:3000 for demo of audio stream')
