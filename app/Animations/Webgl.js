import GSAP from "gsap";

import * as THREE from "three";

import FRAGMENT from "shaders/frag.glsl";
import VERTEX from "shaders/vert.glsl";

export default class Webgl {
  constructor({ elements, canvas }) {
    this.elements = [...elements];
    this.canvas = canvas;

    this.scene = new THREE.Scene();
    this.renderer = null;
    this.camera = null;

    this.meshItems = [];

    this.createSetup();
    this.addMeshes();
  }

  get viewport() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    let aspectRatio = width / height;
    return { width, height, aspectRatio };
  }

  createSetup() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      canvas: this.canvas
    });

    this.perspective = 1000;
    this.fov =
      (180 * (2 * Math.atan(window.innerHeight / 2 / this.perspective))) /
      Math.PI;

    this.camera = new PerspectiveCamera(
      this.fov,
      this.viewport.aspectRatio,
      1,
      this.perspective
    );
    this.camera.position.set(0, 0, this.perspective);

    this.renderer.sortObjects = false;
    this.renderer.outputEncoding = sRGBEncoding;
    this.renderer.setSize(this.viewport.width, this.viewport.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    window.addEventListener("resize", this.onWindowResize.bind(this), false);
  }

  addMeshes() {
    this.elements.forEach((element) => {
      const meshItem = new MeshItem({ element: element, scene: this.scene });
      this.meshItems.push(meshItem);
    });
  }

  onWindowResize() {
    this.camera.aspect = this.viewport.aspectRatio;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.viewport.width, this.viewport.height);
  }

  render() {
    for (let i = 0; i < this.meshItems.length; i++) {
      this.meshItems[i].render();
    }

    this.renderer.render(this.scene, this.camera);
  }
}

class MeshItem {
  constructor({ element, scene }) {
    this.element = element;
    this.scene = scene;
    this.src = this.element.getAttribute("data-src");

    this.vert = VERTEX;
    this.frag = FRAGMENT;

    this.sizes = new THREE.Vector2();
    this.offset = new THREE.Vector2();

    this.createMesh();
  }

  getDimension() {
    const { width, height, top, left } = this.element.getBoundingClientRect();
    this.sizes.set(width, height);
    this.offset.set(
      left - window.innerWidth / 2 + width / 2,
      -top + window.innerHeight / 2 - height / 2
    );
  }

  show() {
    GSAP.to(this.uniforms.uAlpha, {
      onStart: () => {
        this.scene.add(this.mesh);
      },
      value: 1,
      duration: 1,
      ease: "power4.out"
    });
  }

  hide() {
    GSAP.to(this.uniforms.uAlpha, {
      value: 0,
      duration: 1,
      ease: "power4.out",
      onComplete: () => {
        this.scene.remove(this.mesh);
      }
    });
  }

  createMesh() {
    this.geometry = new PlaneGeometry(1, 1, 100, 100);

    this.imageTexture = new TextureLoader().load(
      this.image.getAttribute("data-src")
    );
    this.imageTexture.minFilter = LinearFilter;
    this.imageTexture.generateMipmaps = false;
    this.uniforms = {
      uTexture: {
        value: this.imageTexture
      },
      uOffset: {
        value: new Vector2(0, 0)
      },
      uAlpha: {
        value: 0
      }
    };
    this.uniforms.uniformsNeedUpdate = true;
    this.material = new ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: this.vert,
      fragmentShader: this.frag,
      transparent: true,
      side: DoubleSide
    });
    this.mesh = new Mesh(this.geometry, this.material);
    this.getDimension();
    this.mesh.position.set(this.offset.x, this.offset.y, 1);
    this.mesh.scale.set(this.sizes.x, this.sizes.y, 1);
  }

  render() {
    this.getDimension();
    this.mesh.position.set(this.offset.x, this.offset.y, 1);
    this.mesh.scale.set(this.sizes.x, this.sizes.y, 1);
  }
}
