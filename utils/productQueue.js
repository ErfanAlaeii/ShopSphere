import Queue from "bull";
import { processImage } from "./imageProcessor.js"; 

const imageProcessingQueue = new Queue("imageProcessing");

imageProcessingQueue.process(async (job) => {
  const { imageUrl } = job.data;
  console.log(`Processing image: ${imageUrl}`);
  await processImage(imageUrl); 
});

export default imageProcessingQueue;
