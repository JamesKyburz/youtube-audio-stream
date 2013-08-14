var ytdl    = require('ytdl');
var ffmpeg  = require('fluent-ffmpeg');
var through = require('through');

module.exports = function(uri, opt) {
  opt = opt || {};
  opt.videoFormat = opt.videoFormat || 'mp4';
  opt.audioFormat = opt.audioFormat || 'mp3';

  var video = ytdl(uri, {filter: filterVideo, quality: 'lowest'});

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
