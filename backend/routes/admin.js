import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Placeholder for admin routes
router.get('/dashboard', protect, (req, res) => {
  res.json({ success: true, message: 'Admin dashboard' });
});

router.get('/orders', protect, (req, res) => {
  res.json({ success: true, message: 'Admin orders' });
});

export default router;
