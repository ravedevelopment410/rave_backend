import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.warn('⚠️ No MongoDB URI found in .env — running in fallback mode.');
      return false;
    }

    // Fix dotenv stripping %25 -> % issue: ensure % in password is properly encoded for mongoose
    // dotenv reads %25 literally as %25 which is correct for URL encoding
    // But if dotenv decoded it to %, we must re-encode it
    if (mongoUri.includes('mongodb+srv://') && !mongoUri.includes('%25') && mongoUri.includes('%')) {
      mongoUri = mongoUri.replace(/%(?![0-9A-Fa-f]{2})/g, '%25');
    }

    console.log('🔌 Connecting to MongoDB Atlas...');
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️ MongoDB Connection Failed: ${error.message}`);
    console.warn('ℹ️ Running in resilient fallback mode — all data will load from in-memory seed.');
    return false;
  }
};
