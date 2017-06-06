var ytdl = require('ytdl-core')
var FFmpeg = require('fluent-ffmpeg')
var through = require('through2')
var xtend = require('xtend')
var fs = require('fs')

module.exports = streamify

function streamify (uri, opt) {
  opt = xtend({
    videoFormat: 'mp4',
    quality: 'lowest',
    audioFormat: 'mp3',
    applyOptions: function () {}
  }, opt)

  var video = ytdl(uri, {filter: filterVideo, quality: opt.quality})

  if(opt.response){
    // Will be called when the download starts.
    video.on('response', function (info) {
      var res = opt.response;
      res.writeHead(200, {'Content-Length': info.headers["content-length"]});
      stream.pipe(res)
    });
  }

  function filterVideo (format) {
    return format.container === (opt.videoFormat)
  }

  var stream = opt.file
    ? fs.createWriteStream(opt.file)
    : through()

  var ffmpeg = new FFmpeg(video)
  opt.applyOptions(ffmpeg)
  var output = ffmpeg
    .format(opt.audioFormat)
    .pipe(stream)

  output.on('error', video.end.bind(video))
  output.on('error', stream.emit.bind(stream, 'error'))
  return stream
}
