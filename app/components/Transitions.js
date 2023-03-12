import GSAP from "gsap";

export default class Transition {
  constructor({ element }) {
    this.element = element;

    this.slides = [...this.element.querySelectorAll(".transition-slide")];
  }

  show() {}

  hide() {}
}
