import Page from "classes/Page";

import Splitter from "classes/Splitter";

import Slider from "components/Slider";

import { mapEach } from "utils/dom";

export default class Home extends Page {
  constructor() {
    super({
      classes: {
        active: "active"
      },
      id: "home",
      element: ".home",
      elements: {
        wrapper: ".home-wrapper",
        slider: ".home-slider",
        slides: ".home-slider-slide",
        links: ".home-slider-slide-link",
        title: ".medium-title"
      },
      isScrollable: false
    });
  }

  create() {
    super.create();
    this.createSlider();
    this.createSplitter();
  }

  createSlider() {
    this.slider = new Slider({
      slider: this.elements.slider,
      slides: this.elements.slides,
      direction: "horizontal",
      gap: 0,
      reverse: false,
      autoplay: false,
      dom: true
    });
  }

  createSplitter() {
    this.splitter = mapEach(this.elements.title, (element) => {
      return new Splitter({
        element: element,
        custom: true
      });
    });
  }

  onResize() {
    super.onResize();
  }

  update() {
    super.update();

    if (this.slider) {
      this.slider.update();
    }
  }
}
