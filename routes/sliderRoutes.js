import express from 'express';
import { getSliders, createSlider, updateSlider, deleteSlider } from '../controllers/sliderController.js';

const router = express.Router();

router.route('/').get(getSliders).post(createSlider);
router.route('/:id').put(updateSlider).delete(deleteSlider);

export default router;
