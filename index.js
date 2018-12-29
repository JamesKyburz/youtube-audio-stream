#!/usr/bin/env node
const ytdl = require('ytdl-core')
const FFmpeg = require('fluent-ffmpeg')
const { PassThrough } = require('stream')
const fs = require('fs')

if (!module.parent) {
  const youtubeUrl = process.argv.slice(2)[0]
  if (!youtubeUrl) throw new TypeError('youtube url not specified')
  streamify(youtubeUrl).pipe(process.stdout)
} else {
  module.exports = streamify
}

function streamify (uri, opt) {
  opt = {
    ...opt,
    videoFormat: 'mp4',
    quality: 'lowest',
    audioFormat: 'mp3',
    filter (format) {
      return format.container === opt.videoFormat && format.audioEncoding
    },
    applyOptions () {}
  }

  const video = ytdl(uri, opt)

  const stream = opt.file ? fs.createWriteStream(opt.file) : new PassThrough()

  const ffmpeg = new FFmpeg(video)
  opt.applyOptions(ffmpeg)

  const output = ffmpeg.format(opt.audioFormat).pipe(stream)

  video.on('info', stream.emit.bind(stream, 'info'))
  ffmpeg.on('error', stream.emit.bind(stream, 'error'))
  output.on('error', video.end.bind(video))
  output.on('error', stream.emit.bind(stream, 'error'))
  return stream
}
