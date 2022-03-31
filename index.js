import { createApp } from "https://unpkg.com/petite-vue@0.4.1?module";
import { PlayerState, YtWrapper } from "./src/YtWrapper.js";
import { SongAndTimeLogic } from "./src/SongAndTimeLogic.js";
import { GameLogic, Try, TryType } from "./src/GameLogic.js";
import { TryComponent } from "./src/components/TryComponent.js";
import { PlayerComponent } from "./src/components/PlayerComponent.js";
import { ControlsComponent } from "./src/components/ControlsComponent.js";
import config from "./config.json" assert { type: "json" };

async function main() {
  console.debug("westle starting");

  const songAndTimeLogic = new SongAndTimeLogic();
  const song = songAndTimeLogic.getRandomSong();
  const songs = songAndTimeLogic.getSongs();
  const gameDay = songAndTimeLogic.getGameDay();

  const gameLogic = new GameLogic(song.fqSongName, config.maxTries, gameDay);

  const yt = new YtWrapper(song);
  window.westleYtWrapperInstance = yt;

  await yt.readyCompleter.promise;
  console.debug("westle ready");

  createApp({
    //
    _yt: yt,
    _gameLogic: gameLogic,
    _songAndTimeLogic: songAndTimeLogic,
    songs,
    maxTries: config.maxTries,
    gameDay,
    _song: song,
    //
    get tries() {
      return this._gameLogic.tries;
    },
    get isGameOver() {
      return this._gameLogic.isGameOver;
    },
    get isGameWon() {
      return this._gameLogic.guessed;
    },
    get isGameDone() {
      return this.isGameOver || this.isGameWon;
    },
    //
    copyToClipboard() {
      const emojiText = this._gameLogic.generateEmoji(
        this.gameDay,
      );
      const el = document.createElement("textarea");
      el.value = emojiText;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      window.alert(`Copied to clipboard!`);
    },
    //
    TryComponent,
    PlayerComponent,
    ControlsComponent,
    //
    PlayerState,
    TryType,
    Try,
    //
    _tickSpeed: 500,
    secondsUntilTomorrow: songAndTimeLogic.secondsUntilNextGameDay(),
    mounted() {
      setTimeout(this.tick, this._tickSpeed);
    },
    tick() {
      this.secondsUntilTomorrow -= this._tickSpeed / 1000;
      if (this.secondsUntilTomorrow > 0) {
        setTimeout(this.tick, this._tickSpeed);
      } else {
        setTimeout(window.location.reload(), this._tickSpeed * 2);
      }
    },
  }).mount("#main");
}
window.westleMainFn = main;
