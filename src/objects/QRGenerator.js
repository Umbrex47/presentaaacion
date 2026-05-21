import QRCode from "qrcode";

export default class QRGenerator {
  constructor() {
    this.qrContainer = null;
    this.qrCanvas = null;
  }

  async generateQR(url, containerId = "qr-container") {
    try {
      this.qrContainer = document.getElementById(containerId);
      
      if (!this.qrContainer) {
        console.error("QR Container not found:", containerId);
        return;
      }

      // Limpiar contenido anterior
      this.qrContainer.innerHTML = "";

      // Generar el código QR
      this.qrCanvas = await QRCode.toCanvas(this.qrContainer, url, {
        errorCorrectionLevel: "H",
        type: "image/jpeg",
        quality: 0.95,
        margin: 1,
        width: 300,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      console.log("QR Code generated successfully for:", url);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  }

  async downloadQR(filename = "qr-code.png") {
    if (!this.qrCanvas) {
      console.error("QR code not generated yet");
      return;
    }

    try {
      const link = document.createElement("a");
      link.href = this.qrCanvas.toDataURL("image/png");
      link.download = filename;
      link.click();
    } catch (error) {
      console.error("Error downloading QR code:", error);
    }
  }

  show() {
    if (this.qrContainer) {
      this.qrContainer.style.display = "block";
    }
  }

  hide() {
    if (this.qrContainer) {
      this.qrContainer.style.display = "none";
    }
  }
}
