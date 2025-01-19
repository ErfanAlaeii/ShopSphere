import fs from "fs-extra";
import path from "path";

/**
 * Save the processed image in the file system
 * @param {Buffer} imageBuffer - Processed image
 * @param {string} fileName - Processed image
 * @returns {string} - The path to the saved file
 */
export const saveImageToStorage = async (imageBuffer, fileName) => {
  const dirPath = path.join(__dirname, "../uploads/images"); 
  await fs.ensureDir(dirPath); 
  const filePath = path.join(dirPath, fileName); 
  await fs.writeFile(filePath, imageBuffer); 

  return filePath; 
};
