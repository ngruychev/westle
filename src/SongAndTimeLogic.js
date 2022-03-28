import sample from "https://cdn.skypack.dev/lodash.sample@^4.2.1";
import dateFnsTz from "https://cdn.skypack.dev/date-fns-tz@^1.3.1";
import * as dateFns from "https://cdn.skypack.dev/date-fns@^2.28.0";
import config from "../config.json" assert { type: "json" };

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

export class SongAndTimeLogic {
  constructor(tz = config.timezone) {
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
    if (config.randomSong) {
      return this.getRandomSong();
    } else {
      const day = this.getGameDay();
      const song = this.songs[day % this.songs.length];
    }
    return song;
  }

  getRandomSong() {
    return sample(this.songs);
  }

  getSongs() {
    return this.songs;
  }

  getGameDay() {
    const epoch = config.epoch;
    const utcNow = new Date();
    const tzNow = dateFnsTz.utcToZonedTime(utcNow, this.tz);
    let epochDate = dateFnsTz.utcToZonedTime(utcNow, this.tz);
    epochDate = dateFns.setYear(epochDate, epoch.year);
    epochDate = dateFns.setMonth(epochDate, epoch.month - 1);
    epochDate = dateFns.setDate(epochDate, epoch.day);
    epochDate = dateFns.setHours(epochDate, 0);
    epochDate = dateFns.setMinutes(epochDate, 0);
    epochDate = dateFns.setSeconds(epochDate, 0);
    epochDate = dateFns.setMilliseconds(epochDate, 100);
    const daysSinceEpoch = dateFns.differenceInDays(tzNow, epochDate);
    return Math.floor(daysSinceEpoch) + 1;
  }

  secondsUntilNextGameDay() {
    const utcNow = new Date();
    const tzNow = dateFnsTz.utcToZonedTime(utcNow, this.tz);
    let tomorrow = dateFns.add(dateFnsTz.utcToZonedTime(utcNow, this.tz), {
      days: 1,
    });
    tomorrow = dateFns.setHours(tomorrow, 0);
    tomorrow = dateFns.setMinutes(tomorrow, 0);
    tomorrow = dateFns.setSeconds(tomorrow, 0);
    tomorrow = dateFns.setMilliseconds(tomorrow, 100);
    const secondsUntilTomorrow = (tomorrow - tzNow) / 1000;
    return Math.floor(secondsUntilTomorrow);
  }
}
