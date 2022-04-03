# Westle

## What is that?

Westle is a [Heardle](https://www.heardle.app) clone, but for Ye (formerly known
as Kanye West) songs.

## How to play

1. Listen to the intro, then find the correct Ye song in the list.
2. Skipped or incorrect attempts unlock more of the intro
3. Answer in as few tries as possible and share your score!

You have 6 tries.

## How to set up

Just upload the folder somewhere like [Netlify](https://netlify.com/) or host it
yourself. Make sure that `index.html` is the root of the site.

## Adding songs

The songs.json file contains an object with the following structure:

```json
{
  "songs": [
    {
      "name": "Song title",
      "artist": "Song artist",
      "videoId": "Youtube video id",
      "album": "Song album",
      "offsetMs": "Song offset in milliseconds"
    }
  ]
}
```

- `videoId` is the id of the song on Youtube (e.g. `dQw4w9WgXcQ` in
  `https://www.youtube.com/watch?v=dQw4w9WgXcQ` (Rick Astley - Never Gonna Give
  You Up)).
- `offsetMs` is an amount of milliseconds to skip before the song starts.

## Config

This is what the default `config.json` file looks like:

```json
{
  "epoch": {
    "year": 2022,
    "month": 4,
    "day": 2
  },
  "timezone": "America/Los_Angeles",
  "randomSong": false,
  "maxTries": 6,
  "seed": "kanye west"
}
```

- `epoch` is the date of the first game day.
- `timezone` is the timezone where, at midnight, a new game day starts.
- `randomSong` is whether to play a random song on each game day. This is for
  testing purposes.
- `maxTries` is the maximum number of tries per game day.
- `seed` is a seed with which the songs are shuffled (to prevent the need for
  manual shuffling of songs.json).
