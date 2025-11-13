import express from 'express';
import MenuItem from '../models/MenuItem.js';
import Canteen from '../models/Canteen.js';

const router = express.Router();

// Get all menu items
router.get('/', async (req, res) => {
  try {
    const items = await MenuItem.find().populate('canteen');
    res.json({ 
      success: true, 
      count: items.length,
      items 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get menu items by canteen
router.get('/canteen/:canteenId', async (req, res) => {
  try {
    const { canteenId } = req.params;
    const items = await MenuItem.find({ canteen: canteenId }).populate('canteen');
    res.json({ 
      success: true, 
      count: items.length,
      items 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get menu item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id).populate('canteen');
    if (!item) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search menu items
router.get('/search/query', async (req, res) => {
  try {
    const { q } = req.query;
    const items = await MenuItem.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ]
    }).limit(20);
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
