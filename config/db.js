import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

dotenv.config();

// Fix Node.js Windows DNS SRV lookup issues for MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {}

export const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.warn('⚠️ No MongoDB URI found in .env — running in fallback mode.');
      return false;
    }

    if (mongoUri.includes('mongodb+srv://') && !mongoUri.includes('%25') && mongoUri.includes('%')) {
      mongoUri = mongoUri.replace(/%(?![0-9A-Fa-f]{2})/g, '%25');
    }

    console.log('🔌 Connecting to MongoDB Atlas...');
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️ MongoDB Connection Failed: ${error.message}`);
    console.warn('ℹ️ Running in fallback mode.');
    return false;
  }
};
