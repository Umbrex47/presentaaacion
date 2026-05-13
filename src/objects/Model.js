import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export default class Model {
  constructor(scene, animation, url, onLoaded) {
    this.scene = scene;
    this.animation = animation;
    this.url = url;
    this.onLoaded = onLoaded;
    this.loader = new GLTFLoader();
    this.load();
  }

  load() {
    this.loader.load(this.url, (gltf) => {
      this.model = gltf.scene;
      this.model.scale.set(1.5, 1.5, 1.5);
      this.model.position.set(0, 0, 0);
      this.model.rotation.y = Math.PI * 0.875; // 158.1 grados en radianes
      this.scene.add(this.model);
      if (this.onLoaded) this.onLoaded();
    });
  }
}
