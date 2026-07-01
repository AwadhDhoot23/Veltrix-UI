const mongoose = require('mongoose');

const ComponentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Component name is required'],
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  code: {
    type: String,
    required: [true, 'Component code snippet is required'],
  },
  tags: [{
    type: String,
  }],
  dependencies: [{
    type: String,
  }],
  viewsCount: {
    type: Number,
    default: 0,
  },
},{timestamps:true});

module.exports = mongoose.model('Component', ComponentSchema);
