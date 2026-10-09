/**
 * localStorage is a few megabytes for the whole origin, and photos are the
 * only thing here big enough to threaten it, so anything picked is downscaled
 * before it is ever stored.
 */
export const MAX_EDGE = 900;
const JPEG_QUALITY = 0.72;

/**
 * Reads a picked image, scales its longest edge down to MAX_EDGE and re-encodes
 * it as JPEG. A phone photo is several megabytes; this lands around 60-120KB,
 * which is what makes storing it locally viable at all.
 */
export async function downscaleImage(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new Error("Could not read that image.");
  }
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
}
