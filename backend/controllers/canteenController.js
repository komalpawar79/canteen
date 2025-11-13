import Canteen from '../models/Canteen.js';

export const getAllCanteens = async (req, res) => {
  try {
    const canteens = await Canteen.find({ isActive: true })
      .populate('manager', 'name email');

    res.json({ success: true, canteens });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCanteenById = async (req, res) => {
  try {
    const canteen = await Canteen.findById(req.params.id)
      .populate('manager', 'name email');

    if (!canteen) {
      return res.status(404).json({ error: 'Canteen not found' });
    }

    res.json({ success: true, canteen });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createCanteen = async (req, res) => {
  try {
    const { name, location, description, cuisines, serviceTypes } = req.body;

    const canteen = new Canteen({
      name,
      location,
      description,
      cuisines,
      serviceTypes,
      manager: req.userId
    });

    await canteen.save();
    res.status(201).json({ success: true, canteen });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const searchCanteens = async (req, res) => {
  try {
    const { q, cuisine } = req.query;

    let query = { isActive: true };

    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    if (cuisine) {
      query.cuisines = { $in: [cuisine] };
    }

    const canteens = await Canteen.find(query)
      .populate('manager', 'name email');

    res.json({ success: true, canteens });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
