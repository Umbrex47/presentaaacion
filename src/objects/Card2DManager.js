import Card2D from "./Card2D.js";

export default class Card2DManager {
  constructor() {
    this.cards = [];
    this.container = null;
    this.isInitialized = false;
    this.isVisible = false;
    this.expandedCard = null;
    this.overlay = null;
  }

  init(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    this.container.innerHTML = "";

    this.overlay = document.createElement("div");
    this.overlay.className = "card2d-overlay";
    this.overlay.style.display = "none";
    this.overlay.addEventListener("click", (e) => {
      if (e.target === this.overlay) this.collapseCard();
    });

    const overlayX = document.createElement("button");
    overlayX.className = "card2d-overlay-x";
    overlayX.textContent = "✕";
    overlayX.addEventListener("click", () => this.collapseCard());
    this.overlay.appendChild(overlayX);

    this.container.appendChild(this.overlay);
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
    if (this.overlay) this.overlay.style.display = "block";
  }

  collapseCard(instant = false, restoreBackBtn = true) {
    if (!this.expandedCard) return;
    this.expandedCard.collapse(instant);
    this.expandedCard = null;
    if (restoreBackBtn && this.isVisible) {
      document.getElementById("back-btn").classList.add("visible");
    }
    if (this.overlay) this.overlay.style.display = "none";
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

  render() {}

  show() {
    this.isVisible = true;
  }

  hide() {
    this.isVisible = false;
  }

  updateMouse(mouseX, mouseY) {
    this.cards.forEach((card) => card.updateParallax(mouseX, mouseY));
  }

  resize() {}
}
