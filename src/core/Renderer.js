import * as THREE from "three";

export default class Renderer {
  constructor() {
    this.instance = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.setSize();
    this.setPixelRatio();
    this.instance.outputColorSpace = THREE.SRGBColorSpace;
    document.body.appendChild(this.instance.domElement);
  }

  setSize() {
    this.instance.setSize(window.innerWidth, window.innerHeight);
  }

  setPixelRatio() {
    this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
}