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
    audioFormat: 'mp3'
  })

  var video = ytdl(uri, {filter: filterVideo, quality: opt.quality})

  function filterVideo (format) {
    return format.container === (opt.videoFormat)
  }

  var stream = opt.file
    ? fs.createWriteStream(opt.file)
    : through()

  var convert = new FFmpeg(video)
    .format(opt.audioFormat)
    .pipe(stream)

  convert.on('error', video.end.bind(video))
  convert.on('error', stream.emit.bind(stream, 'error'))

  return stream
}
