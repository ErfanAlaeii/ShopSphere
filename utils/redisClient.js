import redis from 'redis';

const client = redis.createClient({
  host: 'localhost', 
  port: 6379,
});

client.on('connect', () => {
  console.log('Connected to Redis');
});

client.on('error', (err) => {
  console.log('Error connecting to Redis:', err);
});

await client.connect();

export default client;
