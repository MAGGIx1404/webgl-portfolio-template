import Page from "classes/Page";

import Webgl from "Animations/Webgl";

export default class Work extends Page {
  constructor() {
    super({
      classes: {
        active: "active"
      },
      id: "work",
      element: ".work",
      elements: {
        wrapper: ".work-wrapper",
        img: ".webgl-image",
        canvas: ".webgl-canvas"
      },
      isScrollable: true
    });
  }

  create() {
    super.create();
    this.createWebgl();
  }

  createWebgl() {
    this.webgl = new Webgl({
      elements: this.elements.img,
      canvas: this.elements.canvas,
      scroll: this.scroll.scroll
    });
  }

  async show() {
    this.webgl.show();
    super.show();
  }

  async hide() {
    this.webgl.hide();
    super.hide();
  }

  onResize() {
    super.onResize();
  }

  update() {
    super.update();

    if (this.webgl) {
      this.webgl.render();
    }
  }
}
