import Bull from 'bull';
import client from './redisClient.js';

const taskQueue = new Bull('taskQueue', {
  redis: {
    host: 'localhost',
    port: 6379,
  },
});

taskQueue.process(async (job) => {
  if (job.name === 'clearCache') {
    console.log(`Clearing cache for ${job.data.cacheKey}`);
    
    await client.del(job.data.cacheKey);
  }
  return `Job ${job.name} completed`;
});

taskQueue.on('completed', (job, result) => {
  console.log(`Job completed: ${result}`);
});

taskQueue.on('failed', (job, err) => {
  console.log(`Job failed: ${err.message}`);
});

export { taskQueue };
