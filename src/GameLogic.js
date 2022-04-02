import { fuzzy } from "./utils/fuzzy.js";

const TryType = {};
TryType[TryType.SKIP = 0] = "SKIP";
TryType[TryType.FAIL = 1] = "FAIL";
TryType[TryType.SUCCESS = 2] = "SUCCESS";

export { TryType };

export class Try {
  type;
  value;
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }
}

export class GameLogic {
  constructor(songName, maxTries, gameDay) {
    this.gameDay = gameDay;
    this.maxTries = maxTries;
    this.songName = songName;
    if (!this.load()) {
      this.maxedOut = false;
      this.guessed = false;
      this.tries = [];
      this.skipCount = 0;
    }
  }

  save() {
    localStorage.setItem(
      `westle-game-${this.gameDay}`,
      JSON.stringify({
        songName: this.songName,
        maxTries: this.maxTries,
        gameDay: this.gameDay,
        maxedOut: this.maxedOut,
        guessed: this.guessed,
        tries: this.tries,
        skipCount: this.skipCount,
      }),
    );
  }

  load() {
    const saved = localStorage.getItem(`westle-game-${this.gameDay}`);
    if (saved) {
      const {
        maxedOut,
        guessed,
        tries,
        skipCount,
      } = JSON.parse(saved);
      this.maxedOut = maxedOut;
      this.guessed = guessed;
      this.tries = tries;
      this.skipCount = skipCount;
      return true;
    }
    return false;
  }

  get stats() {
    const stats = {
      played: 0,
      won: 0,
      winRate: 0,
      currentStreak: 0,
      maxStreak: 0,
      winHistogram: {
        fail: 0,
        other: [],
        max: 0,
      },
    };
    stats.winHistogram.other = Array.from({ length: this.maxTries }, () => 0);
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith("westle-game-")) {
        const game = JSON.parse(localStorage.getItem(key));
        if (!(game.guessed || game.maxedOut)) {
          continue;
        }
        stats.played++;
        if (game.guessed) {
          stats.won++;
          stats.currentStreak++;
          if (stats.currentStreak > stats.maxStreak) {
            stats.maxStreak = stats.currentStreak;
          }
          stats.maxStreak = Math.max(stats.currentStreak, stats.maxStreak);
          if (game.tries.length !== 0) {
            const idx = game.tries.length - 1;
            if (idx > this.maxTries) {
              continue;
            }
            stats.winHistogram.other[idx] ??= 0;
            stats.winHistogram.other[idx]++;
            stats.winHistogram.max = Math.max(stats.winHistogram.other[idx], stats.winHistogram.max);
          }
        } else {
          stats.currentStreak = 0;
          stats.winHistogram.fail++;
          stats.winHistogram.max = Math.max(stats.winHistogram.fail, stats.winHistogram.max);
        }
      }
    }
    stats.winRate = stats.won / stats.played;
    if (isNaN(stats.winRate)) stats.winRate = 0;
    return stats;
  }

  guess(songName) {
    if (this.maxedOut) {
      return TryType.FAIL;
    }
    if (fuzzy(songName, this.songName)) {
      this.tries.push(
        new Try(
          TryType.SUCCESS,
          songName,
        ),
      );
      this.guessed = true;
    } else {
      this.tries.push(
        new Try(
          TryType.FAIL,
          songName,
        ),
      );
    }
    if (this.tries.length >= this.maxTries) {
      this.maxedOut = true;
    }
    this.save();
  }

  skip() {
    if (this.maxedOut) {
      return TryType.FAIL;
    }
    this.skipCount++;
    this.tries.push(
      new Try(
        TryType.SKIP,
        null,
      ),
    );
    if (this.tries.length >= this.maxTries) {
      this.maxedOut = true;
    }
    this.save();
  }

  get isGameOver() {
    return this.maxedOut && !this.guessed;
  }

  generateEmoji(gameDay = 0) {
    const skipGuessEmoji = "⬛️";
    const wrongGuessEmoji = "🟥";
    const correctGuessEmoji = "🟩";
    const afterCorrectGuessEmoji = "⬜️";
    const gameWonEmoji = "🔉";
    const gameLostEmoji = "🔇";

    const gameEmoji = this.isGameOver ? gameLostEmoji : gameWonEmoji;
    const emojiBar = [];

    for (const _try of this.tries) {
      switch (_try.type) {
        case TryType.SKIP:
          emojiBar.push(skipGuessEmoji);
          break;
        case TryType.FAIL:
          emojiBar.push(wrongGuessEmoji);
          break;
        case TryType.SUCCESS:
          emojiBar.push(correctGuessEmoji);
          break;
      }
    }

    for (let i = this.tries.length; i < this.maxTries; i++) {
      emojiBar.push(afterCorrectGuessEmoji);
    }
    const emojiString = `#Westle #${gameDay}

${gameEmoji}${emojiBar.join("")}

https://westle.app (doesn't actually exist)`;
    return emojiString;
  }
}
