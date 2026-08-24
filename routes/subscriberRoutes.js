import express from 'express';
import { subscribeNewsletter, getSubscribers } from '../controllers/subscriberController.js';

const router = express.Router();

router.route('/').get(getSubscribers);
router.post('/subscribe', subscribeNewsletter);

export default router;
