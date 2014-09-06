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

  new ffmpeg({source: video})
    .toFormat(opt.audioFormat)
    .writeToStream(stream)
  ;

  return stream;

}
