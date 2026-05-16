import Card2D from "./Card2D.js";

export default class Card2DManager {
  constructor() {
    this.cards = [];
    this.container = null;
    this.isInitialized = false;
    this.isVisible = false;
    this.expandedCard = null;
    this.overlay = null;
    this.overlayX = null;
  }

  init(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    this.container.innerHTML = "";

    const stage = document.getElementById("transition-stage");

    this.overlay = document.createElement("div");
    this.overlay.className = "card2d-overlay-global";
    this.overlay.addEventListener("click", (e) => {
      if (e.target === this.overlay) this.collapseCard();
    });
    stage.appendChild(this.overlay);

    this.overlayX = document.createElement("button");
    this.overlayX.className = "card2d-overlay-x-global";
    this.overlayX.textContent = "✕";
    this.overlayX.addEventListener("click", (e) => {
      e.stopPropagation();
      this.collapseCard();
    });
    stage.appendChild(this.overlayX);

    this.isInitialized = true;
  }

  add(options) {
    if (!this.isInitialized) return;
    const card = new Card2D(options, this);
    this.cards.push(card);
    this.container.appendChild(card.el);
    return card;
  }

  toggleExpand(card) {
    if (this.expandedCard === card) return;
    if (this.expandedCard) this.collapseCard(true);
    this.expandCard(card);
  }

  expandCard(card) {
    this.expandedCard = card;
    card.expand();
    document.getElementById("back-btn").classList.remove("visible");
    document.getElementById("farewell-btn").classList.remove("visible");
    if (this.overlay) this.overlay.classList.add("visible");
    if (this.overlayX) this.overlayX.classList.add("visible");
  }

  collapseCard(instant = false, restoreBtns = true) {
    if (!this.expandedCard) return;
    this.expandedCard.collapse(instant);
    this.expandedCard = null;
    if (restoreBtns && this.isVisible) {
      document.getElementById("back-btn").classList.add("visible");
      document.getElementById("farewell-btn").classList.add("visible");
    }
    if (this.overlay) this.overlay.classList.remove("visible");
    if (this.overlayX) this.overlayX.classList.remove("visible");
  }

  showAll(stagger = 0.3, onComplete = null) {
    this.show();
    this.cards.forEach((card, index) => {
      setTimeout(() => card.show(), index * stagger * 1000);
    });
    const totalTime = this.cards.length * stagger * 1000 + 1200;
    if (onComplete) setTimeout(onComplete, totalTime);
  }

  hideAll(delay = 0, stagger = 0.3, onComplete = null) {
    this.collapseCard(true, false);
    const reversed = [...this.cards].reverse();
    reversed.forEach((card, index) => {
      card.hide(delay + index * stagger);
    });
    const totalTime = delay * 1000 + this.cards.length * stagger * 1000 + 800;
    if (onComplete) setTimeout(onComplete, totalTime);
  }

  removeAll() {
    this.collapseCard(true, false);
    this.cards.forEach((c) => c.remove());
    this.cards = [];
  }

  showFarewell() {
    this.collapseCard(true, false);
    this.hide();
    const reversed = [...this.cards].reverse();
    reversed.forEach((card, index) => {
      card.hide(index * 0.15);
    });
    const totalTime = this.cards.length * 0.15 * 1000 + 400;
    setTimeout(() => {
      const farewell = document.getElementById("farewell");
      if (farewell) farewell.classList.add("visible");
      this.generateQR();
    }, totalTime);
  }

  hideFarewell() {
    const farewell = document.getElementById("farewell");
    if (farewell) farewell.classList.remove("visible");
  }

  generateQR() {
    const canvas = document.getElementById("farewell-qr");
    if (!canvas) return;

    import("qrcode").then((QRCode) => {
      QRCode.toCanvas(
        canvas,
        "https://forms.example.com/satisfaccion-unitecnar",
        {
          width: 160,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
        },
        (error) => {
          if (error) console.error("QR error:", error);
        },
      );
    });
  }

  show() {
    this.isVisible = true;
  }

  hide() {
    this.isVisible = false;
  }

  updateMouse(mouseX, mouseY) {
    this.cards.forEach((card) => card.updateParallax(mouseX, mouseY));
  }
}
