import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import Offer from '../models/Offer.js';
import Slider from '../models/Slider.js';
import { connectDB } from '../config/db.js';

dotenv.config();

export const seedProducts = [];

export const seedOffers = [
  {
    title: 'Grand Welcome Deal',
    subtitle: 'Flat 20% OFF on your very first Aravez order',
    badge: 'NEW CUSTOMER',
    couponCode: 'ARAVEZ20',
    discountPercent: 20,
    minSpend: 40,
    validTill: 'Valid all year',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    description: 'Experience natural botanical luxury. Use code ARAVEZ20 at checkout on orders above $40.',
    isActive: true,
    accentColor: 'emerald',
  },
  {
    title: 'Green Glow Botanical Bundle',
    subtitle: 'Save 30% when you buy Serum & Clay Mask together',
    badge: 'BEST VALUE',
    couponCode: 'GLOW30',
    discountPercent: 30,
    minSpend: 60,
    validTill: 'Limited Time',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    description: 'Get our award-winning Serum + Matcha Purifying Mask bundle and unlock glowing skin naturally.',
    isActive: true,
    accentColor: 'teal',
  },
  {
    title: 'Earth Day Wellness Super Saver',
    subtitle: 'Flat 15% OFF across all Organic Herbal Teas & Tinctures',
    badge: 'HERBAL SPECIAL',
    couponCode: 'EARTH15',
    discountPercent: 15,
    minSpend: 30,
    validTill: 'Seasonal Offer',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    description: 'Nourish your wellness rituals with hand-picked herbal tea blends and organic elixirs.',
    isActive: true,
    accentColor: 'green',
  },
  {
    title: 'Free Worldwide Eco Shipping',
    subtitle: 'Complimentary carbon-neutral express shipping on orders over $50',
    badge: 'FREE DELIVERY',
    couponCode: 'FREESHIP',
    discountPercent: 10,
    minSpend: 50,
    validTill: 'Ongoing',
    image: 'https://images.unsplash.com/photo-1608248597359-009a25b6a716?auto=format&fit=crop&w=800&q=80',
    description: 'Enjoy 100% plastic-free, carbon-neutral shipping straight to your doorstep without extra charges.',
    isActive: true,
    accentColor: 'emerald',
  },
];

export const seedSliders = [];

export const seedDatabase = async () => {
  try {
    await connectDB();
    if (mongoose.connection.readyState === 1) {
      await Product.deleteMany({});
      await Offer.deleteMany({});
      await Slider.deleteMany({});
      await Product.insertMany(seedProducts);
      await Offer.insertMany(seedOffers);
      await Slider.insertMany(seedSliders);
      console.log('✅ Aravez Database seeded with products, offers, and hero sliders!');
    } else {
      console.log('⚠️ MongoDB not connected — skipping seed.');
    }
  } catch (error) {
    console.error('Seed Error:', error.message);
  }
};

// If run directly: `node data/seedData.js`
if (process.argv[1] && process.argv[1].includes('seedData.js')) {
  seedDatabase().then(() => {
    console.log('Seeding finished.');
    process.exit(0);
  });
}
