var ytdl     = require('ytdl-core');
var ffmpeg   = require('fluent-ffmpeg');
var through  = require('through2');
var defaults = require('./defaults');
var fs       = require('fs');

module.exports = streamify;

function streamify(uri, opt) {
  defaults.set(opt = opt || {});

  var video = ytdl(uri, {filter: filterVideo, quality: opt.quality});

  function filterVideo(format) {
    return format.container === (opt.videoFormat);
  }

  var stream = opt.file ?
    fs.createWriteStream(opt.file)
    :
    through();

  var convert = new ffmpeg(video)
    .format(opt.audioFormat)
    .pipe(stream)
  ;

  convert.on('error', video.end.bind(video));
  convert.on('error', stream.emit.bind(stream, 'error'));

  return stream;
}
