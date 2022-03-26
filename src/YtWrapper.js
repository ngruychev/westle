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

  constructor(videoId) {
    this.videoId = videoId;
    this.initYtPlayer(videoId);
  }

  initYtPlayer(videoId) {
    this.player = new window.YT.Player("youtube-player", {
      height: "0",
      width: "0",
      videoId,
      playerVars: { autoplay: "0", loop: "0" },
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
    if (
      this.player.getPlayerState() === window.YT.PlayerState.PAUSED ||
      this.player.getPlayerState() === window.YT.PlayerState.BUFFERING ||
      this.player.getPlayerState() === window.YT.PlayerState.CUED
    ) {
      this.player.playVideo();
      this.playingStatus = PlayerState.PLAYING;
    }
  }

  pause() {
    if (this.playingStatus) {
      this.player.pauseVideo();
      this.playingStatus = PlayerState.NOT_PLAYING;
    }
    if (
      this.player.getPlayerState() === window.YT.PlayerState.PLAYING ||
      this.player.getPlayerState() === window.YT.PlayerState.BUFFERING
    ) {
      this.player.pauseVideo();
      this.playingStatus = PlayerState.NOT_PLAYING;
    }
  }

  async playFor(millis) {
    const startTime = this.player.getCurrentTime();
    this.play();
    await this.playSignal.wait();
    const sleepPromise = sleep(millis);
    while ((this.player.getCurrentTime() - startTime) <= (millis / 1000)) {
      await sleep(100);
    }
    await sleepPromise;
    this.pause();
  }

  isPlaying() {
    return this.playingStatus;
  }

  seekToStart() {
    this.player.seekTo(0);
  }

  async seekToStartAndPlay() {
    this.seekToStart();
    await sleep(100);
    this.play();
  }

  async seekToStartAndPlayFor(millis) {
    this.seekToStart();
    await sleep(100);
    await this.playFor(millis);
  }
}
