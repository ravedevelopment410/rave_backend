import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
    },
    tagline: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Please specify category'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
    },
    discountPrice: {
      type: Number,
      default: null,
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 0,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 24,
    },
    image: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      required: true,
    },
    features: {
      type: [String],
      default: [],
    },
    specifications: {
      type: String,
      default: '',
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
    volume: {
      type: String,
      default: '100ml / 3.4 fl oz',
    },
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
