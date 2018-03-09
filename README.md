# youtube-audio-stream

[![js-standard-style](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://github.com/feross/standard)
[![Greenkeeper badge](https://badges.greenkeeper.io/JamesKyburz/youtube-audio-stream.svg)](https://greenkeeper.io/)

This module streams youtube using [ytdl](https://github.com/fent/node-ytdl) to get the youtube download stream.

To convert to audio the module [fluent-ffmpeg](https://github.com/schaermu/node-fluent-ffmpeg) is used.

You will need to have [ffmeg](http://www.ffmpeg.org/) and the necessary encoding libraries installed, as well as in your PATH. If you're on OSX, this can be handled easily using [Homebrew](http://brew.sh/) (`brew install ffmpeg`).

## Getting Started

1. With [npm](http://npmjs.org), run `npm install youtube-audio-stream`
2. `var youtubeStream = require('youtube-audio-stream')`

## Usage

Here is an example that:

1. queries for a video by video ID
2. Retrieves the audio via this package
3. pipes it to `res`

```js
var getAudio = function (req, res) {
  var requestUrl = 'http://youtube.com/watch?v=' + req.params.videoId
  try {
    youtubeStream(requestUrl).pipe(res)
  } catch (exception) {
    res.status(500).send(exception)
  }
}
```

## Node example playing directly to speaker
```js
const stream = require('youtube-audio-stream')
const url = 'http://youtube.com/watch?v=34aQNMvGEZQ'
const decoder = require('lame').Decoder
const speaker = require('speaker')

stream(url)
.pipe(decoder())
.pipe(speaker())
```

## Testing

This package comes with a simple example for testing. This can be run with the command `npm test`, which will then serve the example at `localhost:3000`. The example consists of an `<audio>` component whose source is retrieved via this package.

### Testing inside a docker container

You can test this module without the need o have [ffmeg](http://www.ffmpeg.org/) locally installed
doing it inside a container.

To build the Docker image:
```
docker build . -t youtube-audio-stream-test
```

To run the test:
```
docker run --rm -it -p 3000:3000 youtube-audio-stream-test
```