import * as THREE from "three";

export default class Lights {
  constructor(scene) {
    this.scene = scene;
    this.lights = [];
    this.add();
  }

  add() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);
    this.lights.push(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(3, 4, 5);
    this.scene.add(dirLight);
    this.lights.push(dirLight);
  }
}