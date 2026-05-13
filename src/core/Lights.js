import * as THREE from "three";

export default class Lights {
  constructor(scene) {
    this.scene = scene;
    this.add();
  }

  add() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(5, 5, 5);
    this.scene.add(dirLight);
  }
}