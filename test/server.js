var http = require('http')
var fs = require('fs')
var stream = require('..')
var path = require('path')

var server = http.createServer(requestHandler);

server.on('error', function (err) {
  console.log(err);
});

function requestHandler(req, res) {
  try {
    if (req.url === '/') {
      return fs.createReadStream(path.join(__dirname, '/server.html')).pipe(res)
    }
    if (/youtu/.test(req.url)) {
      var s = stream(req.url.slice(1));

      // Will be called when the download starts.
      s.video.on('response', function (info) {
        if (info.statusCode === 200) {
          res.writeHead(200, {'Content-Length': info.headers["content-length"]});
        }
      });

      s.pipe(res);
    }
    console.log("OK " + req.url);
  } catch (e) {
    console.log(e);
    res.write("ERROR");
    res.end();
  }
}

server.listen(3000);
console.log('open http://localhost:3000 for demo of audio stream')
