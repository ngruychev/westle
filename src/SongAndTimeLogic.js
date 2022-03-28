import sample from "https://cdn.skypack.dev/lodash.sample@^4.2.1";
import shuffleSeed from "https://cdn.skypack.dev/shuffle-seed@^1.1.6";
import dateFnsTz from "https://cdn.skypack.dev/date-fns-tz@^1.3.1";
import * as dateFns from "https://cdn.skypack.dev/date-fns@^2.28.0";
import config from "../config.json" assert { type: "json" };
import songs from "../songs.json" assert { type: "json" };

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
  songs = [];
  constructor(tz = config.timezone) {
    for (const song of songs.songs) {
      this.songs.push(
        new Song(
          song.name,
          song.artist,
          song.videoId,
          song.album ?? undefined,
          song.offsetMs ?? 0,
        ),
      );
    }
    this.tz = tz;
  }

  getTodaySong() {
    if (config.randomSong) {
      return this.getRandomSong();
    } else {
      const day = this.getGameDay();
      const song =
        shuffleSeed.shuffle(
          this.songs,
          config.seed ?? "kanye west",
        )[day % this.songs.length];
      return song;
    }
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
