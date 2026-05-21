import * as THREE from "three";
import QRGenerator from "../objects/QRGenerator.js";

export default class Controls {
  constructor(camera, model, animation, card3DManager = null, scene = null) {
    this.camera = camera;
    this.model = model;
    this.animation = animation;
    this.card3DManager = card3DManager;
    this.scene = scene;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.qrGenerator = new QRGenerator();
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

    if (this.card3DManager && this.card3DManager.updateMouse) {
      this.card3DManager.updateMouse(this.mouse.x, this.mouse.y);
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
    if (this.card3DManager) {
      this.card3DManager.showAll(0.3, () => {
        const btn = document.getElementById("back-btn");
        btn.classList.add("visible");
      });
    }
  }

  setupBackButton() {
    const btn = document.getElementById("back-btn");

    btn.addEventListener("click", () => {
      btn.classList.remove("visible");
      this.card3DManager.hideAll(0, 0.3, () => {
        this.animation.reverseAnimation(this.model, this.camera, () => {
          const overlay = document.getElementById("overlay");
          overlay.classList.remove("hidden");
          overlay.style.pointerEvents = "auto";
          
          // Generar el QR cuando volvemos a la pantalla de cierre
          this.generateClosingQR();
        });
      });
    });
  }

  async generateClosingQR() {
    // Generar el QR con el enlace de feedback
    await this.qrGenerator.generateQR(
      "https://feedback-vr.netlify.app/",
      "qr-closing"
    );
  }
}
