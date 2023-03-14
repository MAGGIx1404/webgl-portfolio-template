import Component from "classes/Component";

export default class Navigation extends Component {
  constructor() {
    super({
      element: ".navigation",
      elements: {
        links: ".navigation-link"
      }
    });
  }

  onChange(url) {
    this.elements.links.forEach((link) => {
      this.name = link.getAttribute("data-name");

      if (url === this.name) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }
}
