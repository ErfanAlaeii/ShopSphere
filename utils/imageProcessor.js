import sharp from "sharp"; 

/**
 * Image processing including resizing and compression
 * @param {Buffer} imageBuffer - Binary image data
 * @param {Object} options - Processing settings
 * @returns {Buffer} - Processed image
 */
export const processImage = async (imageBuffer, options = {}) => {
  try {
    const { width = 800, height = 800, format = "jpeg", quality = 80 } = options;

    const processedImage = await sharp(imageBuffer)
      .resize(width, height, { fit: "cover" })
      .toFormat(format, { quality })
      .toBuffer();

    return processedImage;
  } catch (error) {
    console.error("Error processing image:", error.message);
    throw new Error("Image processing failed");
  }
};
