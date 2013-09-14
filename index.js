var ytdl     = require('ytdl');
var ffmpeg   = require('fluent-ffmpeg');
var through  = require('through');
var defaults = require('./defaults');

module.exports = streamify;

function streamify(uri, opt) {
  defaults.set(opt = opt || {});

  var video = ytdl(uri, {filter: filterVideo, quality: opt.quality});

  function filterVideo(format) {
    return format.container === (opt.videoFormat);
  }

  var stream = through();

  new ffmpeg({source: video})
    .toFormat(opt.audioFormat)
    .writeToStream(stream)
  ;

  return stream;

};
