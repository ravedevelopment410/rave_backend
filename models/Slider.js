import mongoose from 'mongoose';

const sliderSchema = new mongoose.Schema(
  {
    badge: {
      type: String,
      default: '🌿 100% Certified Botanical Wellness',
    },
    title: {
      type: String,
      required: [true, 'Please add a slide title'],
    },
    subtitle: {
      type: String,
      required: [true, 'Please add a slide subtitle'],
    },
    btnText: {
      type: String,
      default: 'Shop Collection',
    },
    btnLink: {
      type: String,
      default: '/products',
    },
    secondaryBtnText: {
      type: String,
      default: 'Explore Offers',
    },
    secondaryBtnLink: {
      type: String,
      default: '/offers',
    },
    image: {
      type: String,
      required: [true, 'Please provide an image URL'],
    },
    floatingText: {
      type: String,
      default: 'Welcome Discount: Code ARAVEZ20 (20% OFF)',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Slider = mongoose.models.Slider || mongoose.model('Slider', sliderSchema);
export default Slider;
