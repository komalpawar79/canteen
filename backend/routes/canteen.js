import express from 'express';
import Canteen from '../models/Canteen.js';

const router = express.Router();

// Get all canteens
router.get('/', async (req, res) => {
  try {
    const canteens = await Canteen.find();
    res.json({ 
      success: true, 
      count: canteens.length,
      canteens 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get canteen by ID
router.get('/:id', async (req, res) => {
  try {
    const canteen = await Canteen.findById(req.params.id);
    if (!canteen) {
      return res.status(404).json({ error: 'Canteen not found' });
    }
    res.json({ success: true, canteen });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get canteen ratings
router.get('/:id/ratings', async (req, res) => {
  try {
    const canteen = await Canteen.findById(req.params.id);
    if (!canteen) {
      return res.status(404).json({ error: 'Canteen not found' });
    }
    res.json({ 
      success: true, 
      rating: canteen.avgRating,
      totalRatings: canteen.totalRatings
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
