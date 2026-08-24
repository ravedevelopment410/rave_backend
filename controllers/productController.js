import mongoose from 'mongoose';
import Product from '../models/Product.js';
import { seedProducts } from '../data/seedData.js';

// @desc    Get all products with search, category, sort, price filter
// @route   GET /api/products
export const getProducts = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sort, featured, bestSeller } = req.query;

    if (mongoose.connection.readyState === 1) {
      let query = {};

      if (category && category !== 'All' && category !== 'All Products') {
        query.category = category;
      }

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { tagline: { $regex: search, $options: 'i' } },
        ];
      }

      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }

      if (featured === 'true') {
        query.isFeatured = true;
      }

      if (bestSeller === 'true') {
        query.isBestSeller = true;
      }

      let sortOption = { createdAt: -1 };
      if (sort === 'price-low') sortOption = { price: 1 };
      if (sort === 'price-high') sortOption = { price: -1 };
      if (sort === 'rating') sortOption = { rating: -1 };
      if (sort === 'popular') sortOption = { reviewsCount: -1 };

      const products = await Product.find(query).sort(sortOption);
      if (products.length > 0) {
        return res.json({ success: true, count: products.length, data: products });
      }
    }

    // Resilient Fallback to seed data
    let filtered = [...seedProducts].map((p, idx) => ({ ...p, _id: p._id || `aravez-prod-${idx + 1}` }));

    if (category && category !== 'All' && category !== 'All Products') {
      filtered = filtered.filter(p => p.category && p.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q)
      );
    }

    if (minPrice) {
      filtered = filtered.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter(p => p.price <= Number(maxPrice));
    }

    if (featured === 'true') {
      filtered = filtered.filter(p => p.isFeatured);
    }

    if (bestSeller === 'true') {
      filtered = filtered.filter(p => p.isBestSeller);
    }

    if (sort === 'price-low') filtered.sort((a, b) => a.price - b.price);
    if (sort === 'price-high') filtered.sort((a, b) => b.price - a.price);
    if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);
    if (sort === 'popular') filtered.sort((a, b) => b.reviewsCount - a.reviewsCount);

    return res.json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Server error fetching products', error: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      const product = await Product.findById(id);
      if (product) {
        return res.json({ success: true, data: product });
      }
    }

    const fallbackProduct = seedProducts.find((p, idx) => id === `aravez-prod-${idx + 1}` || id === p._id);
    if (fallbackProduct) {
      return res.json({ success: true, data: { ...fallbackProduct, _id: id } });
    }

    return res.status(404).json({ success: false, message: 'Product not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Create new product
// @route   POST /api/products
export const createProduct = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const product = await Product.create(req.body);
      return res.status(201).json({ success: true, data: product });
    }

    const newProd = { ...req.body, _id: `aravez-prod-${Date.now()}` };
    seedProducts.unshift(newProd);
    return res.status(201).json({ success: true, data: newProd });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      const updated = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
      if (updated) return res.json({ success: true, data: updated });
    }

    const index = seedProducts.findIndex(p => p._id === id);
    if (index !== -1) {
      seedProducts[index] = { ...seedProducts[index], ...req.body };
      return res.json({ success: true, data: seedProducts[index] });
    }

    return res.status(404).json({ success: false, message: 'Product not found' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      await Product.findByIdAndDelete(id);
      return res.json({ success: true, message: 'Product deleted successfully' });
    }

    const index = seedProducts.findIndex(p => p._id === id);
    if (index !== -1) {
      seedProducts.splice(index, 1);
      return res.json({ success: true, message: 'Product deleted successfully' });
    }

    return res.status(404).json({ success: false, message: 'Product not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get product categories
// @route   GET /api/products/categories/list
export const getCategories = async (req, res) => {
  const categories = [
    'All Products',
    'Touchbooks',
    'Projecters',
    'Interactive Panels',
    'Signages',
    'Active LED',
    'Home Theater',
    'Audio Video Receiver',
    'Speakers',
    'HDMI Cables',
    'TV',
    'Projector Lamps',
    'Professional Lamps',
    'Professional Audio',
    'Teleprompters',
    'VC Cameras',
    'VC Solutions',
    'Video Conferencing Equipments',
  ];
  res.json({ success: true, data: categories });
};

