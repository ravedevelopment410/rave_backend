import express from 'express';
import { getOffers, validateCoupon, createOffer, deleteOffer } from '../controllers/offerController.js';

const router = express.Router();

router.route('/').get(getOffers).post(createOffer);
router.post('/validate-coupon', validateCoupon);
router.route('/:id').delete(deleteOffer);

export default router;
