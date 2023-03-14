import GSAP from "gsap";

import NormalizeWheel from "normalize-wheel";
import { debounce } from "lodash";

export default class Slider {
  constructor({
    slider,
    slides,
    direction = "horizontal",
    gap = 0,
    reverse = false,
    autoplay = false,
    autoplaySpeed = 1,
    dom = true
  }) {
    this.slider = slider;
    this.slides = [...slides];
    this.direction = direction;
    this.gap = gap;
    this.reverse = reverse;
    this.autoplay = autoplay;
    this.autoplaySpeed = autoplaySpeed;
    this.speed = this.autoplaySpeed;
    this.dom = dom;
    this.hovered = false;
    this.sliderBounds =
      this.direction === "horizontal"
        ? this.slider.clientWidth
        : this.slider.clientHeight;
    this.slideBounds =
      this.direction === "horizontal"
        ? this.slides[0].clientWidth + this.gap
        : this.slides[0].clientHeight + this.gap;
    this.sliderSize = this.slideBounds * this.slides.length;
    this.scroll = {
      ease: 0.1,
      current: 0,
      target: 0,
      last: 0,
      position: 0,
      limit: this.sliderSize - this.slideBounds
    };

    this.videos = this.slides.map((slide) => {
      return slide.querySelector(".home-slider-slide-bg");
    });

    this.links = this.slides.map((slide) => {
      return slide.querySelector(".home-slider-slide-link");
    });

    this.touch = {
      start: 0,
      current: 0
    };

    this.isDragging = false;

    this.handleOnCheck = debounce(this.onCheck.bind(this), 100);

    this.addEvents();
  }

  lerp(start, end, t) {
    return start * (1 - t) + end * t;
  }

  createSlides(scroll) {
    GSAP.set(this.slides, {
      x: (i) => {
        if (this.direction === "vertical") return 0;
        return i * this.slideBounds + scroll;
      },
      y: (i) => {
        if (this.direction === "horizontal") return;
        return i * this.slideBounds + scroll;
      },
      modifiers: {
        x: (x) => {
          if (this.direction === "vertical") return 0;
          const s = GSAP.utils.wrap(
            -this.slideBounds,
            this.sliderSize - this.slideBounds,
            parseInt(x)
          );
          return `${s}px`;
        },

        y: (y) => {
          if (this.direction === "horizontal") return 0;
          const s = GSAP.utils.wrap(
            -this.slideBounds,
            this.sliderSize - this.slideBounds,
            parseInt(y)
          );
          return `${s}px`;
        }
      }
    });
    GSAP.set(this.videos, {
      x: (i) => {
        if (this.direction === "vertical") return 0;
        return i * this.slideBounds + scroll;
      },
      y: (i) => {
        if (this.direction === "horizontal") return;
        return i * this.slideBounds + scroll;
      },
      modifiers: {
        x: (x) => {
          if (this.direction === "vertical") return 0;
          const s = GSAP.utils.wrap(
            -this.slideBounds,
            this.sliderSize - this.slideBounds,
            parseInt(x)
          );
          return `${-s}px`;
        },

        y: (y) => {
          if (this.direction === "horizontal") return 0;
          const s = GSAP.utils.wrap(
            -this.slideBounds,
            this.sliderSize - this.slideBounds,
            parseInt(y)
          );
          return `${s}px`;
        }
      }
    });
  }

  resize() {
    this.sliderBounds =
      this.direction === "horizontal"
        ? this.slider.clientWidth
        : this.slider.clientHeight;
    this.slideBounds =
      this.direction === "horizontal"
        ? this.slides[0].clientWidth + this.gap
        : this.slides[0].clientHeight + this.gap;
    this.sliderSize = this.slideBounds * this.slides.length;
  }

  mouseWheel(e) {
    this.normalized = NormalizeWheel(event);
    this.speed = this.normalized.pixelY;
    this.scroll.target += this.speed * 2;

    this.handleOnCheck();
  }

  handleTouchStart(event) {
    this.isDragging = true;
    this.slider.classList.add("is-dragging");
    this.scroll.position = this.scroll.current;
    if (this.direction === "horizontal") {
      this.touch.start = event.touches
        ? event.touches[0].clientX
        : event.clientX;
    }
    if (this.direction === "vertical") {
      this.touch.start = event.touches
        ? event.touches[0].clientY
        : event.clientY;
    }
  }

  handleTouchMove(event) {
    if (!this.isDragging) return;
    let position;
    if (this.direction === "horizontal") {
      position = event.touches ? event.touches[0].clientX : event.clientX;
    }
    if (this.direction === "vertical") {
      position = event.touches ? event.touches[0].clientY : event.clientY;
    }
    const distance = (this.touch.start - position) * 3;
    this.scroll.target = this.scroll.position + distance;
  }

  handleTouchEnd() {
    this.isDragging = false;
    this.slider.classList.remove("is-dragging");

    this.handleOnCheck();
  }

  onCheck() {
    this.itemIndex = Math.round(
      Math.abs(this.scroll.target) / this.slideBounds
    );
    this.item = this.sliderBounds * this.itemIndex;

    if (this.scroll.target < 0) {
      GSAP.to(this.scroll, {
        target: -this.item,
        duration: 0.5
      });
    } else {
      GSAP.to(this.scroll, {
        target: this.item,
        duration: 0.5
      });
    }
  }

  //   add events
  addEvents() {
    if (this.dom) {
      //   mouse wheel event
      this.slider.addEventListener("wheel", this.mouseWheel.bind(this), {
        passive: true
      });

      //   touch events
      this.slider.addEventListener(
        "touchstart",
        this.handleTouchStart.bind(this),
        {
          passive: true
        }
      );
      this.slider.addEventListener(
        "touchmove",
        this.handleTouchMove.bind(this),
        {
          passive: true
        }
      );
      this.slider.addEventListener("touchend", this.handleTouchEnd.bind(this), {
        passive: true
      });

      //   mouse events
      this.slider.addEventListener(
        "mousedown",
        this.handleTouchStart.bind(this),
        {
          passive: true
        }
      );
      this.slider.addEventListener(
        "mousemove",
        this.handleTouchMove.bind(this),
        {
          passive: true
        }
      );
      this.slider.addEventListener("mouseup", this.handleTouchEnd.bind(this), {
        passive: true
      });

      // select event
      this.slider.addEventListener("selectstart", () => {
        return false;
      });
    } else {
      //   mouse wheel event
      window.addEventListener("wheel", this.mouseWheel.bind(this), {
        passive: true
      });

      //   touch events
      window.addEventListener("touchstart", this.handleTouchStart.bind(this), {
        passive: true
      });
      window.addEventListener("touchmove", this.handleTouchMove.bind(this), {
        passive: true
      });
      window.addEventListener("touchend", this.handleTouchEnd.bind(this), {
        passive: true
      });

      //   mouse events
      window.addEventListener("mousedown", this.handleTouchStart.bind(this), {
        passive: true
      });
      window.addEventListener("mousemove", this.handleTouchMove.bind(this), {
        passive: true
      });
      window.addEventListener("mouseup", this.handleTouchEnd.bind(this), {
        passive: true
      });
    }
    this.links.forEach((link) => {
      link.addEventListener("mouseenter", () => {
        this.hovered = true;
      });
      link.addEventListener("mouseleave", () => {
        this.hovered = false;
      });
    });

    //   resize event
    window.addEventListener("resize", this.resize.bind(this));
  }

  //   set scroll
  update() {
    // set autoplay
    if (this.autoplay) {
      this.scroll.target += this.speed;
    }
    // set scroll current
    this.scroll.current = this.lerp(
      this.scroll.current,
      this.scroll.target,
      this.scroll.ease
    );

    // set scroll of slider
    this.createSlides(
      this.reverse ? this.scroll.current : -this.scroll.current
    );

    // set scroll speed
    this.scroll.speed = this.scroll.current - this.scroll.last;

    // set scroll last
    this.scroll.last = this.scroll.current;

    // set autoplay direction
    if (this.scroll.speed > 0) {
      this.speed = this.autoplaySpeed;
    } else {
      this.speed = -this.autoplaySpeed;
    }

    this.scale = this.hovered ? 0.75 : 1;

    GSAP.to(this.slides, {
      skewX: this.scroll.speed * 0.5,
      scale: this.scale - Math.abs(this.scroll.speed) * 0.005
    });

    this.videoScale = this.hovered ? 1.75 : 1.25;

    GSAP.to(this.videos, {
      skewX: -this.scroll.speed * 0.5,
      scale: this.videoScale + Math.abs(this.scroll.speed) * 0.001
    });

    this.currentSlide =
      Math.round(Math.abs(this.scroll.current) / this.slideBounds) %
      this.slides.length;
  }
}
