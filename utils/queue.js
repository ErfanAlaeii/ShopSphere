import { Queue, Worker } from 'bull';


const taskQueue = new Queue('taskQueue', {
  redis: {
    host: 'localhost',
    port: 6379,
  },
});


const worker = new Worker('taskQueue', async (job) => {
  if (job.name === 'clearCache') {
    console.log(`Clearing cache for ${job.data.cacheKey}`);
    
    await client.del(job.data.cacheKey);
  }

  return `Job ${job.name} completed`;
}, { limiter: { max: 10, duration: 1000 } });

worker.on('completed', (job, result) => {
  console.log(`Job completed: ${result}`);
});

worker.on('failed', (job, err) => {
  console.log(`Job failed: ${err.message}`);
});

export { taskQueue };
