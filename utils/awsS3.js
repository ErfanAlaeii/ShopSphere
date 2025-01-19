import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

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
    const data = await s3.upload(params).promise();
    return data.Location;
  } catch (error) {
    console.error("Error uploading to S3:", error.message);
    throw new Error("Error uploading to S3");
  }
};
