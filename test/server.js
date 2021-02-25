const http = require('http')
const fs = require('fs')
const stream = require('..')
const path = require('path')

http.createServer(demo).listen(3000)

function demo (req, res) {
  if (req.url === '/') {
    return fs.createReadStream(path.join(__dirname, '/server.html')).pipe(res)
  }
  if (/youtube/.test(req.url)) {
    stream('http:/' + req.url).pipe(res)
  }
}

console.log('open http://localhost:3000 for demo of audio stream')
