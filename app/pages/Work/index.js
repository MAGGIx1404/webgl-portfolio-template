import Page from "classes/Page";

export default class Work extends Page {
  constructor() {
    super({
      classes: {
        active: "active"
      },
      id: "work",
      element: ".work",
      elements: {
        wrapper: ".work-wrapper"
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
