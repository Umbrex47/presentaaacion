import * as THREE from "three";
import { gsap } from "gsap";

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const TEXTURE_SIZE = isMobile ? 512 : 640;

export default class Card3DManager {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    this.renderer = null;
    this.cards = [];
    this.container = null;
    this.isInitialized = false;
    this.lights = [];
    this.isVisible = false;
  }

  init(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error("Container not found:", containerId);
      return;
    }

    this.renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: isMobile ? "low-power" : "high-performance",
      precision: isMobile ? "mediump" : "highp",
    });

    const size = Math.min(window.innerWidth, window.innerHeight);
    const pixelRatio = isMobile ? 1 : Math.min(window.devicePixelRatio, 1.5);
    this.renderer.setSize(size, size);
    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.container.appendChild(this.renderer.domElement);

    this.camera.position.set(0, 0, 7);
    this.camera.updateProjectionMatrix();

    this.addLights();
    this.isInitialized = true;
  }

  addLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(2, 3, 5);
    this.scene.add(dirLight);

    this.lights.push(ambientLight, dirLight);
  }

  add(options) {
    if (!this.isInitialized) return;

    const card3D = new Card3D(options, this.scene);
    this.cards.push(card3D);
    return card3D;
  }

  showAll(stagger = 0.3, onComplete = null) {
    this.cards.forEach((card, index) => {
      setTimeout(() => {
        card.show();
      }, index * stagger * 1000);
    });

    const totalTime = this.cards.length * stagger * 1000 + 1200;
    setTimeout(() => {
      if (onComplete) onComplete();
    }, totalTime);
  }

  hideAll(delay = 0, stagger = 0.3, onComplete = null) {
    const reversedCards = [...this.cards].reverse();
    reversedCards.forEach((card, index) => {
      card.hide(delay + index * stagger);
    });

    const totalTime = (delay * 1000) + (this.cards.length * stagger * 1000) + 800;
    setTimeout(() => {
      if (onComplete) onComplete();
    }, totalTime);
  }

  removeAll() {
    this.cards.forEach((card) => card.remove(this.scene));
    this.cards = [];
  }

  render() {
    if (!this.isVisible || !this.renderer || !this.scene || !this.camera) return;
    this.renderer.render(this.scene, this.camera);
  }

  show() { this.isVisible = true; }
  hide() { this.isVisible = false; }

  updateMouse(mouseX, mouseY) {
    this.cards.forEach((card) => {
      card.updateRotation(mouseX, mouseY);
      card.updateHover(mouseX, mouseY);
    });
  }

  resize() {
    if (this.container && this.renderer && this.camera) {
      this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
  }
}

class Card3D {
  constructor(options, scene) {
    this.title = options.title || "Card";
    this.description = options.description || "";
    this.icon = options.icon || "";
    this.column = options.column || "left";
    this.order = options.order || 1;
    this.scene = scene;
    this.colorScheme = options.colorScheme || this.getRandomColorScheme();

    this.mesh = null;
    this.glassMesh = null;
    this.create();
  }

  getRandomColorScheme() {
    const schemes = [
      { primary: "#6366f1", secondary: "#a855f7", accent: "#ec4899" },
      { primary: "#3b82f6", secondary: "#06b6d4", accent: "#10b981" },
      { primary: "#8b5cf6", secondary: "#ec4899", accent: "#f59e0b" },
      { primary: "#06b6d4", secondary: "#3b82f6", accent: "#8b5cf6" },
      { primary: "#10b981", secondary: "#6366f1", accent: "#ec4899" },
      { primary: "#f59e0b", secondary: "#ef4444", accent: "#a855f7" },
    ];
    return schemes[Math.floor(Math.random() * schemes.length)];
  }

  createGlassTexture() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const scale = TEXTURE_SIZE / 1024;
    canvas.width = TEXTURE_SIZE;
    canvas.height = Math.floor(768 * scale);

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, this.colorScheme.primary + "20");
    gradient.addColorStop(0.5, this.colorScheme.secondary + "15");
    gradient.addColorStop(1, this.colorScheme.accent + "20");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    ctx.fillRect(0, 0, canvas.width, canvas.height * 0.4);

    const gradient2 = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient2.addColorStop(0, "rgba(255, 255, 255, 0.12)");
    gradient2.addColorStop(0.3, "rgba(255, 255, 255, 0.03)");
    gradient2.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = gradient2;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 2;
    this.roundRect(ctx, 8, 8, canvas.width - 16, canvas.height - 16, 16);
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${Math.floor(60 * scale)}px Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.icon, canvas.width / 2, Math.floor(90 * scale));

    ctx.font = `bold ${Math.floor(45 * scale)}px Arial, sans-serif`;
    ctx.fillStyle = "#ffffff";
    ctx.fillText(this.title, canvas.width / 2, Math.floor(180 * scale));

    ctx.font = `${Math.floor(28 * scale)}px Arial, sans-serif`;
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";

    const words = this.description.split(" ");
    let line = "";
    let y = Math.floor(290 * scale);
    const maxWidth = canvas.width - 60;

    words.forEach((word) => {
      const testLine = line + word + " ";
      if (ctx.measureText(testLine).width > maxWidth) {
        ctx.fillText(line.trim(), canvas.width / 2, y);
        line = word + " ";
        y += Math.floor(35 * scale);
      } else {
        line = testLine;
      }
    });
    ctx.fillText(line.trim(), canvas.width / 2, y);

    const iconY = Math.floor(400 * scale);
    const gradientBar = ctx.createLinearGradient(60, 0, canvas.width - 60, 0);
    gradientBar.addColorStop(0, this.colorScheme.primary);
    gradientBar.addColorStop(0.5, this.colorScheme.secondary);
    gradientBar.addColorStop(1, this.colorScheme.accent);
    ctx.fillStyle = gradientBar;
    ctx.fillRect(60, iconY, canvas.width - 120, 4);
    ctx.globalAlpha = 0.3;
    ctx.fillRect(60, iconY + 12, (canvas.width - 120) / 3, 2);
    ctx.globalAlpha = 1;

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = 4;
    texture.format = THREE.RGBAFormat;
    texture.needsUpdate = true;
    return texture;
  }

  roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  create() {
    const texture = this.createGlassTexture();
    const geometry = new THREE.PlaneGeometry(2.6, 1.9);

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
    });

    this.mesh = new THREE.Mesh(geometry, material);

    const baseX = this.column === "left" ? -3.8 : 3.8;
    const baseRotation = this.column === "left" ? 0.12 : -0.12;

    this.mesh.position.x = baseX + (this.order - 1) * 0.15;
    this.mesh.position.y = (this.order - 2) * 2.2;
    this.mesh.position.z = 0;

    this.mesh.rotation.y = baseRotation + (this.order - 1) * 0.05;

    if (this.order === 2) {
      this.mesh.position.x += this.column === "left" ? 0.6 : -0.6;
    }

    this.mesh.scale.set(0, 0, 0);
    this.scene.add(this.mesh);
  }

  show() {
    gsap.to(this.mesh.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 1.2,
      ease: "back.out(1.5)",
    });

    gsap.to(this.mesh.rotation, {
      x: -0.05,
      duration: 1.5,
      ease: "power2.out",
    });
  }

  hide(delay = 0) {
    gsap.to(this.mesh.scale, {
      x: 0,
      y: 0,
      z: 0,
      duration: 0.5,
      delay,
      ease: "power2.in",
    });
  }

  remove(scene) {
    scene.remove(this.mesh);
  }

  updateRotation(mouseX, mouseY) {
    if (!this.mesh) return;

    const baseRotation = this.column === "left" ? 0.12 : -0.12;
    const targetRotationY = baseRotation + mouseX * 0.06;
    const targetRotationX = mouseY * 0.02;

    this.mesh.rotation.y += (targetRotationY - this.mesh.rotation.y) * 0.03;
    this.mesh.rotation.x += (targetRotationX - this.mesh.rotation.x) * 0.03;
  }

  updateHover(mouseX, mouseY) {
    if (!this.mesh) return;

    const hoverIntensity = 0.02;
    const floatY = Math.sin(Date.now() * 0.001) * 0.03;
    this.mesh.position.z = floatY;
  }
}

export { Card3DManager, Card3D };