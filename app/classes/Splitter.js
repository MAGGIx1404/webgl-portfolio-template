import SplitText from "vendors/split";

export default class Splitter {
  constructor({ element, custom = true, box = false }) {
    this.custom = custom;
    this.box = box;
    this.element = element;
    this.chars = [];
    this.words = [];
    this.lines = [];

    this.createSplitedText();
  }

  createSplitedText() {
    this.splitText = new SplitText(this.element, {
      type: "lines words chars",
      linesClass: "line",
      wordsClass: "word",
      charsClass: "char"
    });

    this.chars = this.splitText.chars;
    this.words = this.splitText.words;
    this.lines = this.splitText.lines;

    this.chars.forEach((char, index) => {
      if (this.custom) {
        char.style.transitionDelay = `${index * 0.05}s`;
      }
      if (this.box) {
        const div = document.createElement("div");
        div.classList.add("char-box");
        div.style.transitionDelay = `${index * 0.05}s`;
        div.innerHTML = char.innerHTML;
        char.innerHTML = "";
        char.appendChild(div);
      }
    });
  }
}
