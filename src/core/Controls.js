import * as THREE from "three";
import { gsap } from "gsap";

export default class Controls {
  constructor(camera, model, animation, cardManager = null, scene = null) {
    this.camera = camera;
    this.model = model;
    this.animation = animation;
    this.cardManager = cardManager;
    this.scene = scene;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.setupListeners();
  }

  setupListeners() {
    window.addEventListener("click", (e) => this.onClick(e));
    window.addEventListener("mousemove", (e) => this.onMouseMove(e));
  }

  updateMouse(e) {
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  onClick(e) {
    this.updateMouse(e);
    this.raycaster.setFromCamera(this.mouse, this.camera);

    if (this.model) {
      const intersects = this.raycaster.intersectObject(this.model, true);
      if (intersects.length > 0) {
        console.log("Modelo clickeado:", intersects[0].object.name);
      }
    }
  }

  onMouseMove(e) {
    this.updateMouse(e);

    if (this.cardManager && this.cardManager.updateMouse) {
      this.cardManager.updateMouse(this.mouse.x, this.mouse.y);
    }
  }

  onClickElement(element) {
    element.addEventListener("click", () => {
      const overlay = document.getElementById("overlay");
      overlay.classList.add("hidden");
      this.animation.custom(this.model, this.camera, () => {
        this.showCards();
      });
    });
  }

  showCards() {
    if (this.cardManager) {
      this.cardManager.show();
      this.cardManager.showAll(0.3, () => {
        gsap.set("#back-btn", { clearProps: "opacity,pointerEvents" });
        gsap.set("#farewell-btn", { clearProps: "opacity,pointerEvents" });
        document.getElementById("back-btn").classList.add("visible");
        document.getElementById("farewell-btn").classList.add("visible");
      });
    }
  }

  setupBackButton() {
    const btn = document.getElementById("back-btn");

    btn.addEventListener("click", () => {
      document.getElementById("farewell-btn").classList.remove("visible");
      btn.classList.remove("visible");
      this.cardManager.collapseCard(true);
      this.cardManager.hideAll(0, 0.3, () => {
        this.cardManager.hide();
        this.animation.reverseAnimation(this.model, this.camera, () => {
          const overlay = document.getElementById("overlay");
          overlay.classList.remove("hidden");
          overlay.style.pointerEvents = "auto";
        });
      });
    });
  }

  setupFarewellButton() {
    const btn = document.getElementById("farewell-btn");

    btn.addEventListener("click", () => {
      document.getElementById("back-btn").classList.remove("visible");
      btn.classList.remove("visible");
      this.cardManager.showFarewell();
    });
  }

  setupFarewellClose() {
    const btn = document.getElementById("farewell-close-btn");

    btn.addEventListener("click", () => {
      this.cardManager.hideFarewell();
      this.cardManager.show();
      this.cardManager.showAll(0.2, () => {
        gsap.set("#back-btn", { clearProps: "opacity,pointerEvents" });
        gsap.set("#farewell-btn", { clearProps: "opacity,pointerEvents" });
        document.getElementById("back-btn").classList.add("visible");
        document.getElementById("farewell-btn").classList.add("visible");
      });
    });
  }
}
