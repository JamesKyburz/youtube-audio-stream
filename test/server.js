var fs = require('fs');
var stream = require('..');
var path = require('path');
var TMP_FOLDER = "tmp";
var express = require('express');
var app = express();
var port = 3000;
var YOUTUBE_REG_EX = "youtu";
//all the routes will be managed by the same request handler
app.get('/', function (req, res) {
    return fs.createReadStream(path.join(__dirname, '/server.html')).pipe(res);
});
//all the routes will be managed by the same request handler
app.get("/*" + YOUTUBE_REG_EX + "*", requestHandler);
//clear the temporary folder every time we launch the server
var tmp_path = path.join(__dirname, TMP_FOLDER);
fs.readdirSync(tmp_path)
    .forEach(function (dir) {
    var location = path.join(tmp_path, dir);
    if (fs.existsSync(location) && location.endsWith(".mp3")) {
        fs.unlink(location);
    }
});
//launch the server
app.listen(port, function () {
    console.log("Youtube audio streamer listening on port " + port + "!");
});
/* ********************************************************************************************************************
 PRIVATE
 *********************************************************************************************************************/
/**
 * Request handler to extract the audio of a Youtube Video and send it as a file
 * @param req
 * @param res
 * @returns {T}
 */
function requestHandler(req, res) {
    try {
        //there is a video request, process it
        if (new RegExp("" + YOUTUBE_REG_EX).test(req.url)) {
            //get the youtube url to request
            var url = req.url.slice(1);
            //remove .mp3 ending if it has it
            if (url.endsWith('.mp3'))
                url = url.substring(0, url.length - 4);
            //get a random filename to save the file
            var fullPath_1 = path.join(__dirname, TMP_FOLDER, Math.random() + ".mp3");
            //request the audio from the video and save it in a file
            var s = stream(url, { file: fullPath_1 });
            //determine the full path of the audio
            //watch the video downloading progress...
            s.video.on('progress', function (chunkSize, acu, total) {
                if (acu === total) {
                    setTimeout(function () {
                        //when the video is ready and save it in a file:
                        // - send it
                        // - remove it
                        res.sendFile(fullPath_1, {
                            headers: {
                                'Content-Length': total
                            }
                        }, function () {
                            fs.unlink(fullPath_1);
                        });
                    }, 1000); //wait a bit for file writing ends
                }
            });
        }
        console.log("OK " + req.url);
    }
    catch (e) {
        console.log(e);
        res.write("ERROR");
        res.end();
    }
}
//# sourceMappingURL=server.js.map