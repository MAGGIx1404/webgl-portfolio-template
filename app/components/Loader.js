import Component from "classes/Component";
import Splitter from "classes/Splitter";

import { each } from "lodash";

import { mapEach } from "utils/dom";

import GSAP from "gsap";

export default class Loader extends Component {
  constructor() {
    super({
      element: ".loader",
      elements: {
        numberBox: ".loader-number",
        number: ".number-text",
        images: document.querySelectorAll("img"),
        titles: document.querySelectorAll(".loader-split-text"),
        content: document.querySelector(".content")
      }
    });

    this.texts = [];
    this.length = 0;
    this.createSplitter();
    this.createLoader();
  }

  createSplitter() {
    this.splitter = mapEach(this.elements.titles, (element) => {
      return new Splitter({
        element: element,
        custom: false
      });
    });

    this.texts = [...this.splitter];
  }

  createLoader() {
    this.showAnimation = GSAP.timeline({
      defaults: {
        stagger: 0.03,
        duration: 0.7,
        ease: "back.inOut"
      }
    });
    this.showAnimation.to(this.elements.titles, { opacity: 1 });
    this.showAnimation.to(this.texts[0].chars, {
      y: "0",
      opacity: 1,
      scale: 1
    });
    this.showAnimation.to(
      this.texts[1].chars,
      {
        y: "0",
        opacity: 1,
        scale: 1
      },
      "-=0.7"
    );
    this.showAnimation.to(
      this.texts[2].chars,
      {
        y: "0",
        opacity: 1,
        scale: 1
      },
      "-=0.7"
    );
    this.showAnimation.call(() => {
      each(this.elements.images, (element) => {
        element.src = element.getAttribute("data-src");
        element.onload = () => {
          element.classList.add("loaded");
          this.onAssetLoaded();
        };
      });
    });
  }

  onAssetLoaded() {
    this.length += 1;
    this.percent = this.length / this.elements.images.length;

    this.number = Math.round(this.percent * 100);

    GSAP.to(this.elements.number, {
      textContent: this.number,
      duration: 1,
      ease: "power4.out",
      onUpdate: () => {
        this.elements.number.textContent = Math.floor(
          this.elements.number.textContent
        );
      }
    });

    if (this.percent === 1) {
      this.onLoaded();
    }
  }

  onLoaded() {
    return new Promise((resolve) => {
      this.animateOut = GSAP.timeline({
        defaults: {
          duration: 0.7,
          stagger: 0.03
        }
      });
      this.animateOut.set(this.elements.content, { y: "100%" });
      this.animateOut.to(this.texts[0].chars, {
        y: "-100%",
        opacity: 0,
        scale: 0,
        ease: "back.inOut"
      });
      this.animateOut.to(
        this.texts[1].chars,
        {
          y: "-100%",
          opacity: 0,
          scale: 0,
          ease: "back.inOut"
        },
        "-=0.7"
      );
      this.animateOut.to(
        this.texts[2].chars,
        {
          y: "-100%",
          opacity: 0,
          scale: 0,
          ease: "back.inOut"
        },
        "-=0.7"
      );
      this.animateOut.to(
        this.elements.numberBox,
        {
          y: "-100%",
          opacity: 0,
          scale: 0,
          ease: "back.inOut"
        },
        "-=0.7"
      );
      this.animateOut.to(this.element, {
        scaleY: 0,
        ease: "expo.inOut"
      });
      this.animateOut.to(
        this.elements.content,
        {
          y: "0%",
          ease: "expo.inOut"
        },
        "-=0.7"
      );
      this.animateOut.call(() => {
        this.emit("completed");
        resolve();
      });
    });
  }

  destroy() {
    this.element.parentNode.removeChild(this.element);
  }
}
