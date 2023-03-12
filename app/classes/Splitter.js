import SplitText from "vendors/split";

export default class Splitter {
  constructor({ element, custom = true }) {
    this.custom = custom;
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
      if (!this.custom) return;
      char.style.transitionDelay = `${index * 0.05}s`;
    });
  }
}
