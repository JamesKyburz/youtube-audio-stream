declare module 'youtube-audio-stream' {
    import ytdl from 'ytdl-core';
    import Ffmpeg from 'fluent-ffmpeg'
    import { PathLike, WriteStream } from 'fs';

    export interface Format {
        readonly container: string;
        readonly audioEncoding;
    }

    export interface Options extends ytdl.downloadOptions {
        readonly file?: PathLike;
        readonly videoFormat?: string;
        readonly audioFormat?: string;
    }

    /**
     * Fetches the audio from the YouTube video.
     *
     * @param uri YouTube video link.
     * @param opt Options to send to process the audio in the video.
     * @returns A audio stream.
     */
    export default function streamify(uri: string, opt?: Options): WriteStream;
}
