import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Placeholder for payment routes
router.post('/initiate', protect, (req, res) => {
  res.json({ success: true, message: 'Payment initiated' });
});

router.post('/verify', protect, (req, res) => {
  res.json({ success: true, message: 'Payment verified' });
});

export default router;
