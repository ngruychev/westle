import { Completer } from "./utils/Completer.js";
import { Signal } from "./utils/Signal.js";
import { sleep } from "./utils/sleep.js";

const PlayerState = {};
PlayerState[PlayerState.BUFFERING = -1] = "BUFFERING";
PlayerState[PlayerState.NOT_PLAYING = 0] = "NOT_PLAYING";
PlayerState[PlayerState.PLAYING = 1] = "PLAYING";

export { PlayerState };

export class YtWrapper {
  player;
  playingStatus = PlayerState.NOT_PLAYING;
  readyCompleter = new Completer();
  playSignal = new Signal();
  pauseSignal = new Signal();

  constructor(song) {
    this.song = song;
    this.initYtPlayer(song);
  }

  initYtPlayer({ videoId, offsetMs }) {
    this.player = new window.YT.Player("youtube-player", {
      height: "0",
      width: "0",
      videoId,
      playerVars: {
        autoplay: 0,
        loop: 0,
        start: offsetMs / 1000,
      },
      events: {
        onReady: () => {
          this.readyCompleter.complete();
          this.player.setPlaybackQuality("small");
          this.playingStatus =
            this.player.getPlayerState() !== window.YT.PlayerState.CUED
              ? PlayerState.PLAYING
              : PlayerState.NOT_PLAYING;
        },
        onStateChange: (e) => {
          if (e.data === window.YT.PlayerState.PLAYING) {
            this.playSignal.send();
          } else if (e.data === window.YT.PlayerState.PAUSED) {
            this.pauseSignal.send();
          }
          if (e.data === window.YT.PlayerState.ENDED) {
            this.playingStatus = PlayerState.NOT_PLAYING;
          }
        },
      },
    });
  }

  play() {
    const playerState = this.player.getPlayerState();
    if (
      playerState === window.YT.PlayerState.PAUSED ||
      playerState === window.YT.PlayerState.BUFFERING ||
      playerState === window.YT.PlayerState.CUED
    ) {
      this.player.playVideo();
      this.playingStatus = PlayerState.PLAYING;
    }
  }

  pause() {
    const playerState = this.player.getPlayerState();
    if (
      playerState === window.YT.PlayerState.PLAYING ||
      playerState === window.YT.PlayerState.BUFFERING
    ) {
      this.player.pauseVideo();
      this.playingStatus = PlayerState.NOT_PLAYING;
    }
  }

  async playFor(ms) {
    const startTime = this.player.getCurrentTime();
    this.play();
    await this.playSignal.wait();
    const sleepPromise = sleep(ms);
    while ((this.player.getCurrentTime() - startTime) <= (ms / 1000)) {
      await sleep(100);
    }
    await sleepPromise;
    this.pause();
  }

  isPlaying() {
    return this.playingStatus;
  }

  seekToStart() {
    this.player.seekTo(this.song.offsetMs / 1000);
  }

  async seekToStartAndPlay() {
    this.seekToStart();
    await sleep(100);
    this.play();
  }

  async seekToStartAndPlayFor(ms) {
    this.seekToStart();
    await sleep(100);
    await this.playFor(ms);
  }
}
