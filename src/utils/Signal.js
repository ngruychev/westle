export class Signal {
  listenerQueue = [];

  send(...args) {
    while (this.listenerQueue.length) {
      this.listenerQueue.shift()(...args);
    }
  }

  wait() {
    return new Promise((resolve) => {
      this.listenerQueue.push(resolve);
    });
  }
}
