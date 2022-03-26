import { createApp } from "https://unpkg.com/petite-vue@0.4.1?module";
import { PlayerState, YtWrapper } from "./src/YtWrapper.js";
import { SongLogic } from "./src/SongLogic.js";
import { GameLogic, TryType } from "./src/GameLogic.js";
import { TryComponent } from "./src/components/TryComponent.js";
import { PlayerComponent } from "./src/components/PlayerComponent.js";
import { ControlsComponent } from "./src/components/ControlsComponent.js";

async function main() {
  console.debug("westle starting");

  const songLogic = new SongLogic();
  const song = songLogic.getRandomSong();
  const songs = songLogic.getSongs();

  const gameLogic = new GameLogic(song.fqSongName, 6);

  const yt = new YtWrapper(song);
  window.westleYtWrapperInstance = yt;

  await yt.readyCompleter.promise;
  console.debug("westle ready");

  createApp({
    //
    _yt: yt,
    _gameLogic: gameLogic,
    songs,
    get longestSongNameLen() {
      return Math.max(...songs.map((song) => song.fqSongName.length));
    },
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
      const emojiText = this._gameLogic.generateEmoji();
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
  }).mount();
}
window.westleMainFn = main;
