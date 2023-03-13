import Lenis from "@studio-freight/lenis";

export default class Scroll {
  constructor({ element, wrapper }) {
    this.element = element;
    this.wrapper = wrapper;
    this.scroll = null;
    this.config = {
      element: this.wrapper,
      wrapper: this.element
    };
    this.init();
    window.requestAnimationFrame(this.raf.bind(this));
  }

  init() {
    this.scroll = new Lenis({
      content: this.config.element
    });
    // reset scroll position
    this.scroll.reset();
  }

  raf(time) {
    this.scroll.raf(time);
    requestAnimationFrame(this.raf.bind(this));
  }

  destroy() {
    this.scroll.destroy();
  }
}
