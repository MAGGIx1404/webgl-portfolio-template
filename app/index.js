import { each } from "lodash";

import Loader from "components/Loader";
import Transition from "components/Transitions";

import Home from "pages/Home";
import About from "pages/About";
import Work from "pages/Work";

class App {
  constructor() {
    if (IS_DEVELOPMENT) {
      console.log("All running in development mode🦸🏻🦹🧛...");
    }
    this.body = document.body;
    this.content = null;
    this.template = null;
    this.pages = {};
    this.page = null;
    this.loader = null;
    this.transition = document.querySelector(".transition");

    this.handleUpdate = this.update.bind(this);
    this.handleOnResize = this.onResize.bind(this);
    this.handleOnPopState = this.onPopState.bind(this);
    this.createLoader();
    this.createContent();
    this.createPages();
    this.createTransition();
    this.addLinkListeners();
    this.addEventListeners();
    this.update();
  }

  createContent() {
    this.content = document.querySelector(".content");
    this.template = this.content.getAttribute("data-template");
  }

  //   create loader
  createLoader() {
    this.loader = new Loader();
    this.loader.once("completed", () => {
      this.onPreloaded();
    });
  }

  createTransition() {
    this.transition = new Transition({
      element: this.transition
    });
  }

  onPreloaded() {
    this.loader.destroy();
    this.onResize();
    this.page.show(true);
    this.body.classList.remove("is-transitioning");
  }

  //   pages
  createPages() {
    this.pages = {
      Home: new Home(),
      About: new About(),
      Work: new Work()
    };
    this.page = this.pages[this.template];
    this.page.create();
  }

  //   page transition

  // ----------
  // page transitions
  async onChange({ url, push = true }) {
    if (url === window.location.href) return;
    this.body.classList.add("is-transitioning");
    await this.page.hide();
    await this.transition.show();
    const res = await window.fetch(url);
    if (res.status === 200) {
      const html = await res.text();
      const fakeDiv = document.createElement("div");
      if (push) {
        window.history.pushState({}, "", url);
      }
      fakeDiv.innerHTML = html;
      const divContent = fakeDiv.querySelector(".content");
      this.template = divContent.getAttribute("data-template");
      this.content.setAttribute(
        "data-template",
        divContent.getAttribute("data-template")
      );
      this.content.innerHTML = divContent.innerHTML;
      this.page = this.pages[this.template];
      this.preloadingOnPageTransition();
    }
  }

  // ----------
  preloadingOnPageTransition() {
    this.imgs = this.content.querySelectorAll("img");
    this.percent = 0;
    this.loadedImgs = 0;
    this.imgs.forEach((img) => {
      img.src = img.getAttribute("data-src");
      img.onload = async () => {
        this.loadedImgs++;
        img.classList.add("loaded");
        this.percent = this.loadedImgs / this.imgs.length;
        if (this.percent === 1) {
          this.page.create();
          this.onResize();
          this.addLinkListeners();
          await this.transition.hide().then(() => {
            this.page.show();
            this.body.classList.remove("is-transitioning");
          });
        }
      };
    });
  }

  addLinkListeners() {
    const links = document.querySelectorAll("a.transition-link");
    each(links, (link) => {
      link.onclick = (e) => {
        e.preventDefault();
        const { href } = link;
        this.onChange({ url: href });
      };
    });
  }

  update(time) {
    if (this.page && this.page.update) {
      this.page.update(time);
    }
    this.frame = window.requestAnimationFrame(this.handleUpdate);
  }

  //   events
  /**
   * Listeners.
   */

  onWheel(event) {
    if (this.page && this.page.onWheel) {
      this.page.onWheel(event);
    }
  }

  onTouchDown(event) {
    if (this.page && this.page.onTouchDown) {
      this.page.onTouchDown(event);
    }
  }

  onTouchMove(event) {
    if (this.page && this.page.onTouchMove) {
      this.page.onTouchMove(event);
    }
  }

  onTouchUp(event) {
    if (this.page && this.page.onTouchUp) {
      this.page.onTouchUp(event);
    }
  }

  addEventListeners() {
    window.addEventListener("resize", this.handleOnResize);
    window.addEventListener("popstate", this.handleOnPopState);

    window.addEventListener("wheel", this.onWheel.bind(this));
    window.addEventListener("touchstart", this.onTouchDown.bind(this));
    window.addEventListener("touchmove", this.onTouchMove.bind(this));
    window.addEventListener("touchend", this.onTouchUp.bind(this));

    window.oncontextmenu = this.onContextMenu;
  }

  // ----------
  // other events
  onContextMenu(event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }

  // ----------
  onPopState() {
    this.onChange({
      url: window.location.pathname,
      push: false
    });
  }

  // ----------
  onResize() {
    window.requestAnimationFrame((_) => {
      if (this.page) {
        this.page.onResize();
      }
    });
  }
}

new App();
