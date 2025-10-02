/**
 * Image helpers:
 * - fileToCanvas(file)
 * - canvasToPngBase64(canvas, maxEdge, quality)
 * Returns raw base64 (no data: prefix) suitable for backend.
 */
export async function fileToCanvas(file: File): Promise<HTMLCanvasElement> {
  const img = await fileToImage(file);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  ctx.drawImage(img, 0, 0);
  return canvas;
}

function fileToImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.onload = () => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Invalid image"));
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Downscales the image so that the longest edge ≤ maxEdge,
 * returns PNG raw base64 (prefix stripped).
 */
export async function canvasToPngBase64(
  sourceCanvas: HTMLCanvasElement,
  maxEdge = 1920
): Promise<string> {
  const { width, height } = sourceCanvas;
  let targetW = width;
  let targetH = height;

  if (Math.max(width, height) > maxEdge) {
    if (width >= height) {
      targetW = maxEdge;
      targetH = Math.round((height / width) * maxEdge);
    } else {
      targetH = maxEdge;
      targetW = Math.round((width / height) * maxEdge);
    }
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  canvas.width = targetW;
  canvas.height = targetH;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(sourceCanvas, 0, 0, targetW, targetH);

  const dataUrl = canvas.toDataURL("image/png");
  return dataUrl.split(",")[1] || ""; // strip "data:image/png;base64,"
}
