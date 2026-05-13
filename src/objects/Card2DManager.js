import Card2D from "./Card2D.js";

export default class Card2DManager {
  constructor() {
    this.cards = [];
    this.container = null;
    this.isInitialized = false;
    this.isVisible = false;
  }

  init(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    this.container.innerHTML = "";
    this.isInitialized = true;
  }

  add(options) {
    if (!this.isInitialized) return;
    const card = new Card2D(options);
    this.cards.push(card);
    this.container.appendChild(card.el);
    return card;
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
    const reversed = [...this.cards].reverse();
    reversed.forEach((card, index) => {
      card.hide(delay + index * stagger);
    });
    const totalTime = delay * 1000 + this.cards.length * stagger * 1000 + 800;
    if (onComplete) setTimeout(onComplete, totalTime);
  }

  removeAll() {
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
