const Festival = require('../models/Festival');

// Create festival (Admin only)
exports.createFestival = async (req, res) => {
  try {
    // Check if user is admin
    const User = require('../models/User');
    const user = await User.findById(req.userId);
    
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can create festivals' });
    }

    const { name, description, festivalType, location, startDate, endDate, category, traditions } = req.body;

    const festival = new Festival({
      name,
      description,
      festivalType,
      location,
      startDate,
      endDate,
      category,
      traditions,
      createdBy: req.userId,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null
    });

    await festival.save();
    await festival.populate('createdBy', 'name email');

    res.status(201).json({
      message: 'Festival created successfully',
      festival
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all festivals sorted by category and type (SIMPLEST ALGORITHM)
exports.getAllFestivals = async (req, res) => {
  try {
    const { category, festivalType, search } = req.query;

    let query = {};

    if (category) {
      query.category = category;
    }

    if (festivalType) {
      query.festivalType = festivalType;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Simple sorting: By category first, then by type, then by date
    const festivals = await Festival.find(query)
      .populate('createdBy', 'name email')
      .sort({ category: 1, festivalType: 1, startDate: 1 });

    res.json(festivals);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single festival
exports.getFestivalById = async (req, res) => {
  try {
    const festival = await Festival.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!festival) {
      return res.status(404).json({ message: 'Festival not found' });
    }

    festival.views += 1;
    await festival.save();

    res.json(festival);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update festival
exports.updateFestival = async (req, res) => {
  try {
    const festival = await Festival.findById(req.params.id);

    if (!festival) {
      return res.status(404).json({ message: 'Festival not found' });
    }

    if (festival.createdBy.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(festival, req.body);
    festival.updatedAt = Date.now();
    await festival.save();

    res.json({ message: 'Festival updated successfully', festival });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete festival
exports.deleteFestival = async (req, res) => {
  try {
    const festival = await Festival.findById(req.params.id);

    if (!festival) {
      return res.status(404).json({ message: 'Festival not found' });
    }

    if (festival.createdBy.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Festival.findByIdAndDelete(req.params.id);
    res.json({ message: 'Festival deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get festivals by category (for dashboard)
exports.getFestivalsByCategory = async (req, res) => {
  try {
    const festivals = await Festival.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          festivals: { $push: '$$ROOT' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(festivals);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
