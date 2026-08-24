import express from 'express';
import { submitContact, getContacts, deleteContact } from '../controllers/contactController.js';

const router = express.Router();

router.route('/').post(submitContact).get(getContacts);
router.route('/:id').delete(deleteContact);

export default router;
