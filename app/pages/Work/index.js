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
  }

  createWebgl() {
    this.webgl = new Webgl({
      elements: this.elements.img,
      canvas: this.elements.canvas
    });
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
