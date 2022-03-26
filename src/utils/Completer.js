// https://stackoverflow.com/a/67007151
// CC-BY-SA 4.0
export class Completer {
  promise;
  isCompleted = false;
  #resolve;
  #reject;

  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.#resolve = resolve;
      this.#reject = reject;
      if (this.isCompleted) {
        this.#resolve();
      }
    });
  }

  complete() {
    this.isCompleted = true;
    this.#resolve();
  }
}
