const triesToSkipIncrements = [
  1,
  2,
  3,
  4,
  5,
  0,
];

export function ControlsComponent({ gameLogic }) {
  return {
    _gameLogic: gameLogic,
    $template: "#controls-component",
    guessTxt: "",
    guess() {
      // force update the guessTxt
      // because petite-vue is brokey
      this.guessTxt = document.getElementById("guess-input").value;
      this._gameLogic.guess(this.guessTxt);
      this.guessTxt = "";
    },
    get tries() {
      return this._gameLogic.tries;
    },
    get tryCount() {
      return this._gameLogic.tries.length;
    },
    get guessed() {
      return this._gameLogic.guessed;
    },
    skip() {
      this._gameLogic.skip();
    },
    get skipIncrement() {
      return triesToSkipIncrements[this.tryCount];
    },
  };
}
