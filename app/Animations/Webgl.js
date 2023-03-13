import GSAP from "gsap";

import * as THREE from "three";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

import FRAGMENT from "shaders/frag.glsl";
import VERTEX from "shaders/vert.glsl";

export default class Webgl {
  constructor({ elements, canvas, scroll }) {
    this.elements = [...elements];
    this.canvas = canvas;
    this.scroll = scroll;

    this.scene = new THREE.Scene();
    this.renderer = null;
    this.camera = null;

    this.meshItems = [];

    this.createSetup();
    this.composerPass();
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

    this.camera = new THREE.PerspectiveCamera(
      this.fov,
      this.viewport.aspectRatio,
      1,
      this.perspective
    );
    this.camera.position.set(0, 0, this.perspective);

    this.renderer.sortObjects = false;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
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

  show() {
    this.meshItems.forEach((meshItem) => {
      meshItem.show();
    });
  }

  hide() {
    this.meshItems.forEach((meshItem) => {
      meshItem.hide();
    });
  }

  composerPass() {
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));

    this.materials = {
      uniforms: {
        tDiffuse: { value: null },
        scrollSpeed: { value: null },
        time: { value: null }
      },
      vertexShader: `
            varying vec2 vUv;
            void main() {
            vUv = uv;
            gl_Position = projectionMatrix
                * modelViewMatrix
                * vec4( position, 1.0 );
            }
        `,
      fragmentShader: `
            uniform sampler2D tDiffuse;
            varying vec2 vUv;
            uniform float scrollSpeed;
            uniform float time;
            void main() {
                vec2 newUV = vUv;
                float area = smoothstep(-0.1,0.3,vUv.y)*4. - 4.;
                newUV.x += (vUv.x - 0.5)*0.1*area*scrollSpeed;

                gl_FragColor = texture2D(tDiffuse, newUV);
            }
            `
    };

    this.customPass = new ShaderPass(this.materials);
    this.customPass.renderToScreen = true;
    this.composer.addPass(this.customPass);
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

    this.customPass.material.uniforms.scrollSpeed.value = Math.abs(
      (this.scroll.target - this.scroll.current) * 0.0009
    );

    this.composer.render();
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
    this.geometry = new THREE.PlaneGeometry(1, 1, 100, 100);

    this.imageTexture = new THREE.TextureLoader().load(this.src);
    this.imageTexture.minFilter = THREE.LinearFilter;
    this.imageTexture.generateMipmaps = false;
    this.uniforms = {
      uTexture: {
        value: this.imageTexture
      },
      uOffset: {
        value: new THREE.Vector2(0, 0)
      },
      uAlpha: {
        value: 0
      },
      uPlaneSizes: { value: [0, 0] },
      uImageSizes: { value: [0, 0] }
    };
    this.uniforms.uniformsNeedUpdate = true;
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: this.vert,
      fragmentShader: this.frag,
      transparent: true,
      side: THREE.DoubleSide
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.getDimension();
    this.mesh.position.set(this.offset.x, this.offset.y, 1);
    this.mesh.scale.set(this.sizes.x, this.sizes.y, 1);
  }

  render() {
    this.getDimension();
    this.mesh.position.set(this.offset.x, this.offset.y, 1);
    this.mesh.scale.set(this.sizes.x, this.sizes.y, 1);

    this.uniforms.uImageSizes.value = [
      this.element.naturalWidth,
      this.element.naturalHeight
    ];
    this.uniforms.uPlaneSizes.value = [this.mesh.scale.x, this.mesh.scale.y];
  }
}
