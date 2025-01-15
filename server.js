import app from './app.js';
import connectDB from './config/db.js'; 

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB();
    console.log('Connected to the database!');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database:', error.message);
    process.exit(1); 
  }
})();
