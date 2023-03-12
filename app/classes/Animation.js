import each from "lodash/each";

export default class {
  constructor({ element, elements }) {
    const { animationDelay, animationTarget } = element.dataset;

    this.delay = animationDelay;

    this.element = element;
    this.elements = elements;

    this.target = animationTarget ? element.closest(animationTarget) : element;

    this.isVisible = false;
  }

  createObserver() {
    this.observer = new IntersectionObserver(
      (entries) => {
        each(entries, (entry) => {
          if (!this.isVisible && entry.isIntersecting) {
            this.animateIn();
          }
        });
      },
      {
        threshold: 0.5
      }
    ).observe(this.target);
  }

  animateIn() {
    this.isVisible = true;
  }

  animateOut() {
    this.isVisible = false;
  }
}
