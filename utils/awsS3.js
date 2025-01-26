import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Save image to S3
 * @param {Buffer} imageBuffer - Processed image
 * @param {string} bucketName - S3 bucket name
 * @param {string} fileName - The name of the file in S3
 * @returns {string} - File URL in S3
 */
export const uploadToS3 = async (imageBuffer, bucketName, fileName) => {
  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: imageBuffer,
    ContentType: "image/jpeg",
    ACL: "public-read",
  };

  try {
    const command = new PutObjectCommand(params);
    await s3.send(command); 
  
    return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
  } catch (error) {
    console.error("Error uploading to S3:", error.message);
    throw new Error("Error uploading to S3");
  }
};
