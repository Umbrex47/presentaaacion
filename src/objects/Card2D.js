import { gsap } from "gsap";
import * as lucide from "lucide";

const ICON_MAP = {
  VR: "Glasses",
  AR: "ScanEye",
  MR: "Blend",
  Apps: "GraduationCap",
  Tech: "Cog",
  Learn: "Brain",
};

export default class Card2D {
  constructor(options, manager) {
    this.title = options.title;
    this.description = options.description;
    this.iconName = options.icon || "Glasses";
    this.color = options.color || "#000000";
    this.column = options.column || "left";
    this.order = options.order || 1;
    this.keyPoints = options.keyPoints || [];
    this.manager = manager;

    this.el = null;
    this.isExpanded = false;
    this.origLeft = "";
    this.origTop = "";
    this.origWidth = 0;
    this.create();
  }

  create() {
    this.el = document.createElement("div");
    this.el.className = "card2d";
    this.el.style.setProperty("--card-color", this.color);

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

    const iconHtml = this.renderIcon();
    const keyPointsHtml = this.keyPoints.length
      ? `<ul class="card2d-keypoints">${this.keyPoints.map((k) => `<li>${k}</li>`).join("")}</ul>`
      : "";

    this.el.innerHTML = `
      <div class="card2d-body">
        <div class="card2d-inner">
          <div class="card2d-hleft">
            <div class="card2d-icon">${iconHtml}</div>
            <div class="card2d-title">${this.title}</div>
          </div>
          <div class="card2d-hright">
            <div class="card2d-line"></div>
            <div class="card2d-desc">${this.description}</div>
            ${keyPointsHtml}
            <div class="card2d-bar"></div>
          </div>
        </div>
      </div>
    `;

    gsap.set(this.el, { xPercent: -50, yPercent: -50, scale: 0 });

    this.el.addEventListener("click", (e) => {
      if (this.manager) this.manager.toggleExpand(this);
    });
  }

  renderIcon() {
    const lucideName = ICON_MAP[this.iconName] || "Glasses";
    const iconDef = lucide[lucideName];
    if (iconDef && lucide.createElement) {
      const svg = lucide.createElement(iconDef);
      return svg ? svg.outerHTML : "";
    }
    return "";
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
    if (keypoints) {
      keypoints.style.display = "block";
      const items = keypoints.querySelectorAll("li");
      gsap.fromTo(
        items,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          stagger: 0.1,
          ease: "power2.out",
        },
      );
    }

    gsap.set(this.el, { zIndex: 1000 });

    this.origWidth = this.el.offsetWidth;
    const targetWidth = Math.min(460, window.innerWidth * 0.75);

    gsap.to(this.el, {
      left: "50%",
      top: "50%",
      xPercent: -50,
      yPercent: -50,
      width: targetWidth,
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

    gsap.to(this.el, {
      left: this.origLeft,
      top: this.origTop,
      xPercent: -50,
      yPercent: -50,
      width: this.origWidth,
      duration: instant ? 0.01 : 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        this.el.style.width = "";
        gsap.set(this.el, { zIndex: "" });
      },
    });
  }
}
