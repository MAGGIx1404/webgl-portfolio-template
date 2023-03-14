import GSAP from "gsap";

import Page from "classes/Page";

import Splitter from "classes/Splitter";

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
        canvas: ".webgl-canvas",
        nextTitle: ".next-link",
        nextFigure: ".next-figure",
        nextPicture: ".next-picture"
      },
      isScrollable: true
    });
    this.hover = false;
  }

  create() {
    super.create();
    this.createWebgl();
    this.createSplitter();
    this.createAnimation();
  }

  createWebgl() {
    this.webgl = new Webgl({
      elements: this.elements.img,
      canvas: this.elements.canvas,
      scroll: this.scroll.scroll
    });
  }

  createSplitter() {
    this.splitter = new Splitter({
      element: this.elements.nextTitle,
      custom: true
    });
  }

  createAnimation() {
    this.elements.nextTitle.addEventListener("mouseenter", () => {
      this.hover = true;
    });

    this.elements.nextTitle.addEventListener("mouseleave", () => {
      this.hover = false;
    });
  }

  async show() {
    this.webgl.show();
    super.show();
  }

  async hide() {
    this.hover = false;
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

    this.scale = this.hover ? 0.75 : 1;
    this.imageScale = this.hover ? 1.5 : 1;

    GSAP.to(this.elements.nextFigure, {
      scale: this.scale
    });

    GSAP.to(this.elements.nextPicture, {
      scale: this.imageScale
    });
  }
}
