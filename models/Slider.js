import mongoose from 'mongoose';

const sliderSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: [true, 'Please provide an image URL'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Slider = mongoose.models.Slider || mongoose.model('Slider', sliderSchema);
export default Slider;
