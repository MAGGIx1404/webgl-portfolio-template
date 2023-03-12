import GSAP from "gsap";

export default class Transition {
  constructor({ element }) {
    this.element = element;

    this.slides = [...this.element.querySelectorAll(".transition-slide")];
  }

  async show() {
    return new Promise((resolve) => {
      this.showAnimation = GSAP.timeline({
        defaults: {
          duration: 1,
          ease: "expo.inOut"
        }
      });
      this.showAnimation.set(this.slides, { transformOrigin: "center bottom" });
      this.showAnimation.to(this.slides, {
        scaleY: 1,
        stagger: 0.1,
        onComplete: () => {
          resolve();
        }
      });
    });
  }

  async hide() {
    return new Promise((resolve) => {
      this.hideAnimation = GSAP.timeline({
        defaults: {
          duration: 1,
          ease: "expo.inOut"
        }
      });
      this.hideAnimation.set(this.slides, { transformOrigin: "center top" });
      this.hideAnimation.to(this.slides, {
        scaleY: 0,
        stagger: -0.1,
        onComplete: () => {
          resolve();
        }
      });
    });
  }
}
