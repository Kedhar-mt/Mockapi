const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  endpoint: {
    type: String,
    unique: true,
  },
  attributes: [
    {
      label: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
    },
  ],
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  },
});

module.exports = mongoose.model('Resource', ResourceSchema);