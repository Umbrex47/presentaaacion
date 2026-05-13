import Renderer from "./core/Renderer.js";
import Scene from "./core/Scene.js";
import Lights from "./core/Lights.js";
import Animation from "./core/Animation.js";
import Controls from "./core/Controls.js";
import Card2DManager from "./objects/Card2DManager.js";

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const TARGET_FPS = isMobile ? 30 : 60;
const FRAME_INTERVAL = 1000 / TARGET_FPS;

export default class Experience {
  constructor() {
    this.renderer = new Renderer();
    this.scene = new Scene();
    this.lights = new Lights(this.scene.instance);
    this.animation = new Animation();
    this.controls = null;
    this.cardManager = null;
    this.model = null;
    this.lastFrameTime = 0;
    this.isRendering = false;

    this.init();
  }

  async init() {
    this.loadModel();
    this.addResizeListener();
    this.animate();
  }

  loadModel() {
    import("./objects/Model.js").then(({ default: Model }) => {
      this.model = new Model(
        this.scene.instance,
        this.animation,
        "/elements/VP.glb",
        () => this.onModelLoaded(),
      );
    });
  }

  onModelLoaded() {
    this.cardManager = new Card2DManager();
    this.cardManager.init("card3d-container");

    this.cardManager.add({
      title: "Realidad Virtual",
      description: "Sumérgete en mundos digitales completamente nuevos con tecnología de realidad virtual avanzada",
      icon: "VR",
      column: "left",
      order: 1,
    });
    this.cardManager.add({
      title: "Realidad Aumentada",
      description: "Mezcla el mundo real con elementos virtuales para crear experiencias únicas e interactivas",
      icon: "AR",
      column: "left",
      order: 2,
    });
    this.cardManager.add({
      title: "Innovación",
      description: "Nuevas tecnologías que transforman la educación y el entretenimiento para siempre",
      icon: "✨",
      column: "left",
      order: 3,
    });
    this.cardManager.add({
      title: "Aplicaciones",
      description: "Desde medicina hasta arquitectura, la VR/AR revoluciona múltiples industrias del mundo",
      icon: "🎓",
      column: "right",
      order: 1,
    });
    this.cardManager.add({
      title: "Tecnología",
      description: "Dispositivos de última generación como visores, guantes hápticos y controladores",
      icon: "⚙️",
      column: "right",
      order: 2,
    });
    this.cardManager.add({
      title: "Futuro",
      description: "El límite es tu imaginación. El futuro de la tecnología está aquí y ahora",
      icon: "🔮",
      column: "right",
      order: 3,
    });

    this.controls = new Controls(
      this.scene.camera,
      this.model.model,
      this.animation,
      this.cardManager,
      this.scene,
    );
    this.controls.onClickElement(document.getElementById("immerssion-btn"));
    this.controls.setupBackButton();
  }

  addResizeListener() {
    window.addEventListener("resize", () => {
      this.renderer.setSize();
      this.renderer.setPixelRatio();
      this.scene.resize();
      if (this.cardManager) {
        this.cardManager.resize();
      }
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const now = performance.now();
    const elapsed = now - this.lastFrameTime;

    if (elapsed < FRAME_INTERVAL) return;
    this.lastFrameTime = now - (elapsed % FRAME_INTERVAL);

    this.renderer.instance.render(this.scene.instance, this.scene.camera);
    if (this.cardManager && this.cardManager.isVisible) {
      this.cardManager.render();
    }
  }
}

new Experience();