import GSAP from "gsap";

import SplitText from "vendors/split";

import Animation from "classes/Animation";

export default class Text extends Animation {
  constructor({ element }) {
    const splitedElement = new SplitText(element, {
      type: "lines",
      linesClass: "line"
    });

    const lines = splitedElement.lines;

    lines.forEach((line) => {
      const div = document.createElement("div");
      div.appendChild(line);
      element.appendChild(div);
      div.classList.add("line-box");
    });

    GSAP.set(lines, {
      y: "100%",
      opacity: 0,
      rotate: 5,
      transformOrigin: "0 0"
    });

    super({
      element,
      elements: {
        lines: lines
      }
    });
  }

  animateIn() {
    GSAP.to(this.elements.lines, {
      duration: 1,
      y: 0,
      opacity: 1,
      stagger: 0.2,
      ease: "power3.out",
      rotate: 0
    });
  }

  animateOut() {
    GSAP.to(this.elements.lines, {
      y: "100%",
      opacity: 0,
      rotate: 5,
      stagger: {
        each: 0.1,
        from: "end"
      },
      ease: "power3.in"
    });
  }
}
