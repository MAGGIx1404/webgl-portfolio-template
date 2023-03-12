import { each } from "lodash";

import Loader from "components/Loader";

import Home from "pages/Home";
import About from "pages/About";

class App {
  constructor() {
    if (IS_DEVELOPMENT) {
      console.log("All running in development mode🦸🏻🦹🧛...");
    }
    this.content = null;
    this.template = null;
    this.pages = {};
    this.page = null;
    this.loader = null;

    this.handleUpdate = this.update.bind(this);
    this.handleOnResize = this.onResize.bind(this);
    this.handleOnPopState = this.onPopState.bind(this);
    this.createLoader();
    this.createContent();
    this.createPages();
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

  onPreloaded() {
    this.loader.destroy();
    this.onResize();
    this.page.show(true);
  }

  //   pages
  createPages() {
    this.pages = {
      Home: new Home(),
      About: new About()
    };
    this.page = this.pages[this.template];
    this.page.create();
  }

  //   page transition

  // ----------
  // page transitions
  async onChange({ url, push = true }) {
    if (url === window.location.href) return;
    await this.page.hide();
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
          return new Promise((resolve) => {
            this.page.create();
            this.onResize();
            this.addLinkListeners();
            this.page.show();
            resolve();
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
  addEventListeners() {
    window.addEventListener("resize", this.handleOnResize);
    window.addEventListener("popstate", this.handleOnPopState);

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
