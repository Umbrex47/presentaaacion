import Renderer from "./core/Renderer.js";
import Scene from "./core/Scene.js";
import Lights from "./core/Lights.js";
import Animation from "./core/Animation.js";
import Controls from "./core/Controls.js";
import Card2DManager from "./objects/Card2DManager.js";
import Particles from "./objects/Particles.js";

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
    this.particles = null;
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
    this.particles = new Particles(this.scene.instance);

    this.cardManager = new Card2DManager();
    this.cardManager.init("card3d-container");

    this.cardManager.add({
      title: "Realidad Virtual",
      description: "Simulación tridimensional inmersiva que sustituye el mundo real mediante tecnología digital",
      icon: "VR",
      color: "#3B82F6",
      column: "left",
      order: 1,
      keyPoints: ["Inmersión total", "Captura de movimiento", "Procesamiento y salida visual"],
    });
    this.cardManager.add({
      title: "Realidad Aumentada",
      description: "Superposición de elementos digitales sobre el entorno físico en tiempo real",
      icon: "AR",
      color: "#10B981",
      column: "left",
      order: 2,
      keyPoints: ["Superposición digital", "Interacción en vivo", "Dispositivos accesibles"],
    });
    this.cardManager.add({
      title: "Realidad Mixta",
      description: "Fusión de realidad virtual y aumentada para interacción híbrida entre objetos reales y digitales",
      icon: "MR",
      color: "#8B5CF6",
      column: "left",
      order: 3,
      keyPoints: ["Combinación VR+AR", "Continuo virtualidad", "Interacción híbrida"],
    });
    this.cardManager.add({
      title: "Aplicaciones",
      description: "Medicina, arquitectura, educación y entretenimiento se transforman con VR/AR/MR",
      icon: "Apps",
      color: "#F59E0B",
      column: "right",
      order: 1,
      keyPoints: ["Simulación quirúrgica", "Recorridos arquitectónicos", "Aprendizaje inmersivo"],
    });
    this.cardManager.add({
      title: "Tecnología",
      description: "Sensores, 6DoF, baja latencia y lentes Fresnel hacen posible la inmersión total",
      icon: "Tech",
      color: "#06B6D4",
      column: "right",
      order: 2,
      keyPoints: ["6DoF (seis grados libertad)", "Latencia < 20ms", "Lentes Fresnel"],
    });
    this.cardManager.add({
      title: "Aprender Haciendo",
      description: "La VR no reemplaza la experiencia, la hace accesible para todos los estudiantes",
      icon: "Learn",
      color: "#EF4444",
      column: "right",
      order: 3,
      keyPoints: ["Traer la realidad al aula", "Experiencia sin riesgo", "Práctica vivencial"],
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
    this.controls.setupFarewellButton();
    this.controls.setupFarewellClose();

    const loader = document.getElementById("loader");
    if (loader) loader.classList.add("hidden");
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
    if (this.particles) {
      this.particles.update(now * 0.001);
    }
    if (this.cardManager && this.cardManager.isVisible) {
      this.cardManager.render();
    }
  }
}

new Experience();
