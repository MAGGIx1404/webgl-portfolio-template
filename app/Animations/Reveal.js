import Animation from "classes/Animation";

export default class Reveal extends Animation {
  constructor({ element }) {
    super({ element, elements: {} });
  }

  animateIn() {
    this.element.classList.add("is-revealed");
  }

  animateOut() {
    this.element.classList.remove("is-revealed");
  }
}
