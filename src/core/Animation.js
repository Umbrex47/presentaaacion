import { gsap } from "gsap";

export default class Animation {
  constructor() {
    this.tweens = [];
  }

  float(model) {
    const tween = gsap.to(model.position, {
      y: -2,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });
    this.tweens.push(tween);
  }

  scrollDown(model) {
    const tween = gsap.to(model.position, {
      y: -10,
      duration: 1,
      ease: "power1.inOut",
    });
    this.tweens.push(tween);
  }

  custom(model, camera, onComplete = null) {
    model.userData.originalPosition = model.position.clone();
    model.userData.originalScale = model.scale.clone();
    model.userData.originalRotation = model.rotation.clone();

    let tl = gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete();
      },
    });
    tl.to(model.rotation, { duration: 0.5, y: Math.PI * 2.35 })
      .to(model.position, { duration: 0.3, x: -0.3 })
      .to(model.scale, { duration: 1, x: 3, y: 3, z: 3 })
      .to(model.position, { duration: 1, y: -4 })
      .to(camera.position, { duration: 1, z: 0.1 })
      .to("#transition-stage", {
        duration: 1,
        opacity: 1,
      })
      .to("#transition-stage", {
        duration: 1,
        backgroundColor: "#ffffff",
      })
      .set("#transition-stage", { pointerEvents: "auto" });
    this.tweens.push(tl);
  }

  reverseAnimation(model, camera, onComplete = null) {
    const originalPos = model.userData.originalPosition;
    const originalScale = model.userData.originalScale;
    const originalRot = model.userData.originalRotation;

    let tl = gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete();
      },
    });
    tl.to("#transition-stage", {
      duration: 1,
      backgroundColor: "#0000",
    })
      .to("#transition-stage", {
        duration: 1,
        opacity: 0,
      })
      .to(camera.position, { duration: 1, z: 5 })
      .to(model.position, { duration: 1, x: originalPos.x, y: originalPos.y })
      .to(model.scale, {
        duration: 1,
        x: originalScale.x,
        y: originalScale.y,
        z: originalScale.z,
      })
      .to(model.rotation, { duration: 1, y: originalRot.y })
      .to("#transition-stage", { duration: 0.5, opacity: 0, zIndex: 0 })
      .set("#transition-stage", { pointerEvents: "none" })
      .to("#back-btn", { duration: 0.3, opacity: 0, pointerEvents: "none" });
    this.tweens.push(tl);
  }

  pauseAll() {
    this.tweens.forEach((tween) => tween.pause());
  }

  resumeAll() {
    this.tweens.forEach((tween) => tween.resume());
  }

  killAll() {
    this.tweens.forEach((tween) => tween.kill());
    this.tweens = [];
  }
}
