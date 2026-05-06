const mongoose = require('mongoose');

const festivalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  festivalType: {
    type: String,
    enum: ['Religious', 'Seasonal', 'National', 'Regional', 'Cultural', 'Social'],
    required: true
  },
  location: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  image: {
    type: String,
    default: null
  },
  imageUrl: {
    type: String,
    default: null
  },
  cultural_significance: {
    type: String,
    default: ''
  },
  traditions: [String],
  category: {
    type: String,
    enum: ['Dance', 'Music', 'Art', 'Food', 'Heritage', 'Sports'],
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for sorting by category/type
festivalSchema.index({ category: 1, festivalType: 1 });

module.exports = mongoose.model('Festival', festivalSchema);
