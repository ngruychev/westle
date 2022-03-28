import { fuzzy } from "./utils/fuzzy.js";

// enum TryType
// {
//    Skip,
//    Fail,
//    Success
// }
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
  constructor(songName, maxTries) {
    this.songName = songName;
    this.maxTries = maxTries;
    this.maxedOut = false;
    this.guessed = false;
    this.tries = [];
    this.skipCount = 0;
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
    // fill the rest of the bar until this.maxTries
    for (let i = this.tries.length; i < this.maxTries; i++) {
      emojiBar.push(afterCorrectGuessEmoji);
    }
    const emojiString = `#Westle #${gameDay}

${gameEmoji}${emojiBar.join("")}

https://westle.app (doesn't actually exist)`;
    return emojiString;
  }
}
