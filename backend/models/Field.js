const mongoose = require('mongoose');

const FieldSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  resource: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource',
  },
});

module.exports = mongoose.model('Field', FieldSchema);