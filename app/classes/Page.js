import each from "lodash/each";

import Text from "Animations/Text";
import Reveal from "Animations/Reveal";

import Scroll from "components/Scroll";

import { mapEach } from "utils/dom";

export default class Page {
  constructor({ classes, id, element, elements, isScrollable = false }) {
    this.classes = {
      ...classes
    };
    this.id = id;
    this.selector = element;
    this.selectorChildren = {
      textAnimations: '[data-animation="text"]',
      revealAnimations: '[data-animation="reveal"]',
      ...elements
    };
    this.scroll = null;
    this.element = element;
    this.elements = {};
    this.isVisible = false;
    this.animations = [];

    this.isScrollable = isScrollable;
  }

  /**
   * Select Elements from DOM and init necessery things
   */
  create() {
    this.animations = [];
    this.element = document.querySelector(this.selector);
    this.elements = {};

    each(this.selectorChildren, (entry, key) => {
      if (
        entry instanceof window.HTMLElement ||
        entry instanceof window.NodeList ||
        Array.isArray(entry)
      ) {
        this.elements[key] = entry;
      } else {
        this.elements[key] = this.element.querySelectorAll(entry);
        if (this.elements[key].length === 0) {
          this.elements[key] = null;
        } else if (this.elements[key].length === 1) {
          this.elements[key] = this.elements[key][0];
        }
      }
    });

    this.createAnimations();
    this.createSmoothScroll();
  }

  createSmoothScroll() {
    if (this.isScrollable) {
      this.scroll = new Scroll({
        element: this.element,
        wrapper: this.elements.wrapper
      });
    }
  }

  createAnimations() {
    this.texts = mapEach(this.elements.textAnimations, (element) => {
      return new Text({ element: element });
    });

    this.animations.push(...this.texts);

    this.reveals = mapEach(this.elements.revealAnimations, (element) => {
      return new Reveal({ element: element });
    });

    this.animations.push(...this.reveals);
  }

  /**
   * Page Show Transition
   */
  async show() {
    this.onResize();
    this.isVisible = true;
    this.element.classList.add("active");
    this.animations.forEach((animation) => {
      animation.createObserver();
    });
    return Promise.resolve();
  }

  /**
   * Page Hide Transition
   */
  async hide() {
    this.destroy();
    each(this.animations, (animation) => {
      animation.animateOut && animation.animateOut();
    });
    this.element.classList.remove("active");
    this.isVisible = false;
    if (this.scroll) this.scroll.destroy();
    return Promise.resolve();
  }

  /**
   * Update function for request animation frame
   */

  update() {}

  /**
   * On Resize event Handler
   */
  onResize() {}

  /**
   * Create and Register common event listeners
   */
  addEventListeners() {}

  /**
   * Remove event listeners. Call on Page Hide
   */
  removeEventListeners() {}

  /**
   * Alias of removeEventListener
   */
  destroy() {
    this.removeEventListeners();
  }
}
