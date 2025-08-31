import jimp from "jimp";

export default async function resizeBase64Image(
  base64OrUrl: string,
  opts?: {
    maxSize?: number;
  }
) {
  if (!base64OrUrl.startsWith("data:")) {
    return base64OrUrl;
  }
  const mimeMatch = base64OrUrl.match(/^data:(\w+\/\w+);/);
  const mimetype = mimeMatch?.[1];
  if (!mimetype) {
    throw new Error(`Could not distinguish mimetype`);
  }
  const buffer = Buffer.from(base64OrUrl.replace(/^data:image\/\w+;base64,/, ""), "base64");

  const { maxSize = 96 * 4 } = opts ?? {};
  const image = await jimp.read(buffer);
  const currentSize = Math.max(image.getWidth(), image.getHeight());
  if (currentSize > maxSize) {
    image.resize(jimp.AUTO, maxSize);
  }
  const newBuffer = await image.getBufferAsync(mimetype);

  return `data:${mimetype};base64,${newBuffer.toString("base64")}`;
}
