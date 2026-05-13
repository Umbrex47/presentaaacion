import { gsap } from "gsap";

export default class Card2D {
  constructor(options) {
    this.title = options.title;
    this.description = options.description;
    this.icon = options.icon;
    this.column = options.column || "left";
    this.order = options.order || 1;

    this.el = null;
    this.create();
  }

  create() {
    this.el = document.createElement("div");
    this.el.className = "card2d";

    const xPos = this.column === "left" ? "22%" : "78%";
    const yPos = 22 + (this.order - 1) * 24;

    this.el.style.left = xPos;
    this.el.style.top = `${yPos}%`;

    this.el.innerHTML = `
      <div class="card2d-decoration card2d-corner-tl"></div>
      <div class="card2d-decoration card2d-corner-tr"></div>
      <div class="card2d-decoration card2d-corner-bl"></div>
      <div class="card2d-decoration card2d-corner-br"></div>
      <div class="card2d-icon">${this.icon}</div>
      <div class="card2d-line"></div>
      <div class="card2d-title">${this.title}</div>
      <div class="card2d-desc">${this.description}</div>
      <div class="card2d-bar"></div>
    `;

    gsap.set(this.el, { xPercent: -50, yPercent: -50, scale: 0 });
  }

  show(delay = 0) {
    gsap.to(this.el, {
      scale: 1,
      duration: 1.2,
      delay,
      ease: "back.out(1.5)",
      overwrite: "auto",
    });
  }

  hide(delay = 0) {
    gsap.to(this.el, {
      scale: 0,
      duration: 0.5,
      delay,
      ease: "power2.in",
      overwrite: "auto",
    });
  }

  remove() {
    if (this.el && this.el.parentNode) {
      this.el.parentNode.removeChild(this.el);
    }
  }

  updateParallax(mouseX, mouseY) {
    if (!this.el) return;
    gsap.to(this.el, {
      xPercent: -50 + mouseX * 4,
      yPercent: -50 + mouseY * -2,
      duration: 0.3,
      overwrite: "auto",
      ease: "power1.out",
    });
  }
}
