import { PlayerState } from "../YtWrapper.js";

const triesToPlayTime = [
  1_000,
  1_000 + 1_000,
  1_000 + 1_000 + 2_000,
  1_000 + 1_000 + 2_000 + 3_000,
  1_000 + 1_000 + 2_000 + 3_000 + 4_000,
  1_000 + 1_000 + 2_000 + 3_000 + 4_000 + 5_000,
  1_000 + 1_000 + 2_000 + 3_000 + 4_000 + 5_000 + 6_000,
];

export function PlayerComponent({ yt, gameLogic }) {
  return {
    _yt: yt,
    _gameLogic: gameLogic,
    $template: "#player-component",
    get _playTime() {
      return triesToPlayTime[this._gameLogic.tries.length];
    },
    play() {
      this._yt.seekToStartAndPlayFor(this._playTime);
    },
    get playingStatus() {
      return this._yt.playingStatus;
    },
    get playingStatusText() {
      return PlayerState[this._yt.playingStatus];
    },
  }
}