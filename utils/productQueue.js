import Queue from "bull";
import { processImage } from "./imageProcessor.js";
import { saveImageToStorage } from "../utils/storage.js";
import { uploadToS3 } from "../utils/awsS3.js";

const imageProcessingQueue = new Queue("imageProcessing");

imageProcessingQueue.process(async (job) => {
    const { imageUrl, options, fileName } = job.data;
    console.log(`Processing image: ${imageUrl}`);

    try {

        const processedImage = await processImage(imageUrl, options);


        const imageUrl = await uploadToS3(processedImage, "your-bucket-name", fileName);

        console.log("Image uploaded at:", imageUrl);
    } catch (error) {
        console.error("Error in image processing:", error.message);
        throw error;
    }
});

export const productQueue = new Queue("productQueue");

productQueue.process(async (job) => {
    const { imageBuffer, options, fileName } = job.data;

    try {

        const processedImage = await processImage(imageBuffer, options);


        const filePath = await saveImageToStorage(processedImage, fileName);

        console.log("Image saved at:", filePath);
    } catch (error) {
        console.error("Error in image processing:", error.message);
        throw error;
    }
});

export { imageProcessingQueue, productQueue };
