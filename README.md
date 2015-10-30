# youtube-audio-stream

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

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

```
var getAudio = function (req, res) {
  var requestUrl = 'http://youtube.com/watch?v=' + req.params.videoId
  try {
    youtubeStream(requestUrl).pipe(res)
  } catch (exception) {
    res.status(500).send(exception)
  }
}
```

## Testing

This package comes with a simple example for testing. This can be run with the command `npm test`, which will then serve the example at `localhost:3000`. The example consists of an `<audio>` component whose source is retrieved via this package.