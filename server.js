import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import offerRoutes from './routes/offerRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import subscriberRoutes from './routes/subscriberRoutes.js';
import sliderRoutes from './routes/sliderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database (with non-blocking resilient handler)
connectDB();

// Universal CORS Middleware for Hostinger (https://aravez.store) & Render
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(morgan('dev'));

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/newsletter', subscriberRoutes);
app.use('/api/sliders', sliderRoutes);
app.use('/api/upload', uploadRoutes);


// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    message: 'Aravez Backend API is running smoothly',
    timestamp: new Date().toISOString(),
  });
});

// Root route
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: system-ui, -apple-system, sans-serif; padding: 40px; text-align: center; background: #ecfdf5; color: #064e3b; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
      <h1 style="font-size: 2.5rem; margin-bottom: 8px;">🌿 Aravez Backend API</h1>
      <p style="font-size: 1.1rem; color: #059669; max-width: 600px;">Modern MERN Stack Backend running on Node.js, Express & MongoDB.</p>
      <div style="margin-top: 20px; background: white; border-radius: 12px; padding: 20px 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); text-align: left; line-height: 2;">
        <strong>Available Endpoints:</strong><br/>
        • <code>GET /api/products</code> - List & filter products<br/>
        • <code>GET /api/offers</code> - Promotional deals & coupons<br/>
        • <code>POST /api/contact</code> - Submit inquiries<br/>
        • <code>POST /api/newsletter/subscribe</code> - Newsletter signup<br/>
        • <code>GET /api/health</code> - Server status
      </div>
    </div>
  `);
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found on Aravez server` });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Exception:', err);
  res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Aravez Backend server is active on http://localhost:${PORT}`);
});
