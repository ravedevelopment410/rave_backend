import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add offer title'],
    },
    subtitle: {
      type: String,
      required: true,
    },
    badge: {
      type: String,
      default: 'Special Deal',
    },
    couponCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    discountPercent: {
      type: Number,
      required: true,
    },
    minSpend: {
      type: Number,
      default: 0,
    },
    validTill: {
      type: String,
      default: 'Limited Time Offer',
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    accentColor: {
      type: String,
      default: 'emerald',
    },
  },
  { timestamps: true }
);

const Offer = mongoose.models.Offer || mongoose.model('Offer', offerSchema);
export default Offer;
