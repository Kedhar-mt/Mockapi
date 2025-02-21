const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  label: String,
  value: mongoose.Schema.Types.Mixed, // Can be a string, number, or an object
  nestedResource: {
    type: mongoose.Schema.Types.Mixed, // Allows deep nesting of objects
    default: null,
  },
});

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  resources: [resourceSchema], // Array of resources, each can be an object or primitive
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
