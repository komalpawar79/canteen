import MenuItem from '../models/MenuItem.js';
import Canteen from '../models/Canteen.js';

export const getMenuByCanteen = async (req, res) => {
  try {
    const { canteenId } = req.params;
    const { cuisine, dietary, category, sortBy } = req.query;

    let query = { canteen: canteenId, isAvailable: true };

    if (cuisine) query.cuisine = cuisine;
    if (dietary) query.dietary = dietary;
    if (category) query.category = category;

    let items = MenuItem.find(query);

    if (sortBy === 'price') items = items.sort({ price: 1 });
    if (sortBy === 'rating') items = items.sort({ rating: -1 });
    if (sortBy === 'popular') items = items.sort({ ordersCount: -1 });

    const menuItems = await items.populate('canteen');

    res.json({
      success: true,
      count: menuItems.length,
      items: menuItems
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMenuItemById = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id).populate('canteen');
    if (!item) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const searchMenu = async (req, res) => {
  try {
    const { q } = req.query;
    
    const items = await MenuItem.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ],
      isAvailable: true
    }).limit(20);

    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRecommendations = async (req, res) => {
  try {
    const { canteenId } = req.params;

    const topItems = await MenuItem.find({ 
      canteen: canteenId,
      isAvailable: true,
      tags: 'popular'
    })
      .sort({ ordersCount: -1 })
      .limit(8);

    res.json({ success: true, recommendations: topItems });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
