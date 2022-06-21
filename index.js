#!/usr/bin/env node

"use strict";

const ytdl = require("ytdl-core");
// const FFmpeg = require("fluent-ffmpeg");
const { PassThrough } = require("stream");
const fs = require("fs");

if (!module.parent) {
  const youtubeUrl = process.argv.slice(2)[0];
  if (!youtubeUrl) throw new TypeError("youtube url not specified");
  streamify(youtubeUrl).pipe(process.stdout);
} else {
  module.exports = streamify;
}

const { Converter } = require("ffmpeg-stream");
const { createReadStream, createWriteStream } = require("fs");

function streamify(uri, opt) {
  opt = {
    ...opt,
    videoFormat: "mp4",
    quality: "lowest",
    audioFormat: "mp3",
    filter(format) {
      return format.container === opt.videoFormat && format.audioBitrate;
    },
  };

  const video = ytdl(uri, opt);
  const { file, audioFormat } = opt;
  const stream = file ? fs.createWriteStream(file) : new PassThrough();
  const ffmpeg = new Converter();

  process.nextTick(() => {
    ffmpeg.createInputFromFile("./audio.aac");
    ffmpeg.run();
    ffmpeg
      .createOutputStream({
        f: "adts",
        acodec: "libfdk_aac",
        profile: "aac_he_v2",
        ab: "48k",
      })
      .pipe(stream);
    // const output = ffmpeg.format(audioFormat).pipe(stream);
    // const output = ffmpeg.input;
    // output.r;
    // console.log(typeof output);
    // ffmpeg.once("error", (error) => stream.emit("error", error));
    // output.once("error", (error) => {
    //   video.end();
    //   stream.emit("error", error);
    // });
  });

  stream.video = video;
  stream.ffmpeg = ffmpeg;

  return stream;
}
