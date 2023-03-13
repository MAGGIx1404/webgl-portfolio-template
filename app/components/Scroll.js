import NormalizeWheel from "normalize-wheel";
import Prefix from "prefix";

import { clamp, lerp } from "utils/math";

export default class Scroll {
  constructor({ element }) {
    this.element = element;

    this.scroll = {
      ease: 0.05,
      current: 0,
      target: 0,
      position: 0,
      limit: 0
    };

    this.isDown = false;

    this.prefix = Prefix("transform");
  }

  setScroll(element, value) {
    element.style[this.prefix] = `translate3d(0, ${-Math.round(value)}px, 0)`;
  }

  setLimit() {
    this.scroll.limit = this.element.clientHeight - window.innerHeight;
  }

  update() {
    this.scroll.target = clamp(0, this.scroll.limit, this.scroll.target);

    this.scroll.current = lerp(
      this.scroll.current,
      this.scroll.target,
      this.scroll.ease
    );

    if (this.scroll.current < 0.1) {
      this.scroll.current = 0;
    }

    if (this.element) {
      this.setScroll(this.element, this.scroll.current);
    }
  }

  //   events

  onTouchDown(event) {
    this.isDown = true;

    this.scroll.position = this.scroll.current;
    this.start = event.touches ? event.touches[0].clientY : event.clientY;
  }

  onTouchMove(event) {
    const y = event.touches ? event.touches[0].clientY : event.clientY;
    const distance = (this.start - y) * 2;

    this.scroll.target = this.scroll.position + distance;
  }

  onTouchUp(event) {
    this.isDown = false;
  }

  onWheel(event) {
    const normalized = NormalizeWheel(event);
    const speed = normalized.pixelY;
    this.scroll.target += speed * 2;
  }
}
