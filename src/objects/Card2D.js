import { gsap } from "gsap";

export default class Card2D {
  constructor(options, manager) {
    this.title = options.title;
    this.description = options.description;
    this.icon = options.icon;
    this.column = options.column || "left";
    this.order = options.order || 1;
    this.keyPoints = options.keyPoints || [];
    this.manager = manager;

    this.el = null;
    this.isExpanded = false;
    this.origLeft = "";
    this.origTop = "";
    this.create();
  }

  create() {
    this.el = document.createElement("div");
    this.el.className = "card2d";

    const isLeft = this.column === "left";
    let xPos = isLeft ? "22%" : "78%";
    if (this.order === 2) {
      xPos = isLeft ? "16%" : "84%";
    }
    const yPos = 20 + (this.order - 1) * 28;

    this.origLeft = xPos;
    this.origTop = `${yPos}%`;

    this.el.style.left = this.origLeft;
    this.el.style.top = this.origTop;

    const keyPointsHtml = this.keyPoints.length
      ? `<ul class="card2d-keypoints">${this.keyPoints.map((k) => `<li>${k}</li>`).join("")}</ul>`
      : "";

    this.el.innerHTML = `
      <button class="card2d-close-btn">✕</button>
      <div class="card2d-icon">${this.icon}</div>
      <div class="card2d-line"></div>
      <div class="card2d-title">${this.title}</div>
      <div class="card2d-desc">${this.description}</div>
      ${keyPointsHtml}
      <div class="card2d-bar"></div>
    `;

    gsap.set(this.el, { xPercent: -50, yPercent: -50, scale: 0 });

    this.el.addEventListener("click", (e) => {
      if (e.target.closest(".card2d-close-btn")) return;
      if (this.manager) this.manager.toggleExpand(this);
    });

    const closeBtn = this.el.querySelector(".card2d-close-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (this.manager) this.manager.collapseCard();
      });
    }
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
    if (!this.el || this.isExpanded) return;
    gsap.to(this.el, {
      xPercent: -50 + mouseX * 4,
      yPercent: -50 + mouseY * -2,
      duration: 0.3,
      overwrite: "auto",
      ease: "power1.out",
    });
  }

  expand() {
    if (this.isExpanded) return;
    this.isExpanded = true;
    gsap.killTweensOf(this.el);

    this.el.classList.add("card2d-expanded");

    const keypoints = this.el.querySelector(".card2d-keypoints");
    if (keypoints) keypoints.style.display = "block";

    const closeBtn = this.el.querySelector(".card2d-close-btn");
    if (closeBtn) closeBtn.classList.add("visible");

    gsap.set(this.el, { zIndex: 100 });

    gsap.to(this.el, {
      left: "50%",
      top: "50%",
      xPercent: -50,
      yPercent: -50,
      scale: 2.5,
      duration: 0.6,
      ease: "power3.out",
    });
  }

  collapse(instant = false) {
    if (!this.isExpanded) return;
    this.isExpanded = false;
    gsap.killTweensOf(this.el);

    this.el.classList.remove("card2d-expanded");

    const keypoints = this.el.querySelector(".card2d-keypoints");
    if (keypoints) keypoints.style.display = "";

    const closeBtn = this.el.querySelector(".card2d-close-btn");
    if (closeBtn) closeBtn.classList.remove("visible");

    gsap.set(this.el, { zIndex: "" });

    gsap.to(this.el, {
      left: this.origLeft,
      top: this.origTop,
      xPercent: -50,
      yPercent: -50,
      scale: 1,
      duration: instant ? 0.01 : 0.5,
      ease: "power2.inOut",
    });
  }
}
