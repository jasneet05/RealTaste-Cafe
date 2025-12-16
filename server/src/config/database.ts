import mongoose from 'mongoose';
import config from './config';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error}`);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

// Create text indexes for search functionality
mongoose.connection.once('open', async () => {
  try {
    await Promise.all([
      mongoose.model('Product').collection.createIndex({ name: 'text', description: 'text' }),
      mongoose.model('Category').collection.createIndex({ name: 'text' })
    ]);
    console.log('Text indexes created successfully');
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
});
