import Page from "classes/Page";

import Splitter from "classes/Splitter";

import Webgl from "Animations/Webgl";

import { mapEach } from "utils/dom";

export default class About extends Page {
  constructor() {
    super({
      classes: {
        active: "active"
      },
      id: "about",
      element: ".about",
      elements: {
        wrapper: ".about-wrapper",
        bigTexts: ".big-texts"
      },
      isScrollable: true
    });
  }

  create() {
    super.create();
    this.createSplitter();
  }

  createSplitter() {
    this.splitter = mapEach(this.elements.bigTexts, (element) => {
      return new Splitter({
        element: element,
        custom: true,
        box: true
      });
    });
  }

  onResize() {
    super.onResize();
  }
}
