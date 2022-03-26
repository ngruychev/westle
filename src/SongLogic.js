/*
SongLogic is the logic for choosing songs based on time and day.
*/

import sample from "https://cdn.skypack.dev/lodash.sample@^4.2.1";
import tzOffset from "https://cdn.skypack.dev/tz-offset@^0.0.2";

export class Song {
  constructor(name, artist, videoId, album = undefined, offsetMs = 0) {
    this.name = name;
    this.artist = artist;
    this.videoId = videoId;
    this.album = album;
    this.offsetMs = offsetMs;
  }

  get fqSongName() {
    let n = `${this.artist} -  ${this.name}`;
    if (this.album) {
      n += ` ( ${this.album} )`;
    }
    return n;
  }
}

export class SongLogic {
  constructor(tz = "America/Los_Angeles") {
    this.songs = [
      new Song(
        "I Love It",
        "Kanye West & Lil Pump",
        "cwQgjq0mCdE",
        undefined,
        1000,
      ),
      new Song(
        "Lift Yourself",
        "Kanye West",
        "8fbyfDbi-MI",
      ),
      new Song(
        "Skit #4",
        "Kanye West",
        "Y4r6lS04RpQ",
        "Late Registration",
      ),
    ];
    this.tz = tz;
  }

  getTodaySong() {
    // throw new Error("not implemented");
    const now = tzOffset.timeAt(new Date(), this.tz);
    const daysSinceEpoch = Math.floor(now / (1000 * 60 * 60 * 24));
    const song = this.songs[daysSinceEpoch % this.songs.length];
    return song;
  }

  getRandomSong() {
    return sample(this.songs);
  }

  getSongs() {
    return this.songs;
  }
}
