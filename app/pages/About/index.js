import Page from "classes/Page";

export default class About extends Page {
  constructor() {
    super({
      classes: {
        active: "active"
      },
      id: "about",
      element: ".about",
      elements: {
        wrapper: ".about-wrapper"
      },
      isScrollable: true
    });
  }

  create() {
    super.create();
  }

  onResize() {
    super.onResize();
  }
}
