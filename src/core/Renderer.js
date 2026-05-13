import * as THREE from "three";

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export default class Renderer {
  constructor() {
    this.instance = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: isMobile ? "low-power" : "high-performance",
      precision: isMobile ? "mediump" : "highp",
    });
    this.setSize();
    this.setPixelRatio();
    this.instance.outputColorSpace = THREE.SRGBColorSpace;
    this.instance.setClearColor(0x000000, 0);
    document.body.appendChild(this.instance.domElement);
  }

  setSize() {
    this.instance.setSize(window.innerWidth, window.innerHeight);
  }

  setPixelRatio() {
    const maxRatio = isMobile ? 1 : 1.5;
    this.instance.setPixelRatio(Math.min(window.devicePixelRatio, maxRatio));
  }
}