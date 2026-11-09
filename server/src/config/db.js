import mongoose from 'mongoose';

export const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smartshelf_ai';
  
  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[MongoDB Warning]: Could not connect to external MongoDB instance (${error.message}).`);
    console.warn(`[MongoDB Fallback]: Attempting memory-backed fallback mode for standalone execution.`);
    
    try {
      // Dynamic import in case mongodb-memory-server is installed or use fallback connection options
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`[MongoDB Memory Server Connected]: ${uri}`);
      return conn;
    } catch (memErr) {
      console.error('[MongoDB Error]: Fallback memory server unavailable. Running in-memory database mode directly.');
      // Keep app alive for mock store operations
      return null;
    }
  }
};
