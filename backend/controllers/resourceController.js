const Resource = require('../models/Resource');
const Project = require('../models/Project');
const express = require('express');
const router = express.Router();

// Create a new resource
const createResource = async (req, res) => {
  const { name, projectId, attributes } = req.body;
  try {
    const project = await Project.findById(projectId);
    const endpoint = `/api/projects/${project.name.toLowerCase().replace(/\s+/g, '-')}/${name.toLowerCase().replace(/\s+/g, '-')}`;

    const newResource = new Resource({ name, endpoint, project: projectId, attributes });
    await newResource.save();

    project.resources.push(newResource._id);
    await project.save();

    router.get(endpoint, (req, res) => {
      res.json({
        message: `This is the API endpoint for ${name}`,
        data: {
          id: newResource._id,
          name: newResource.name,
          attributes: newResource.attributes,
        },
      });
    });

    res.status(201).json(newResource);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { createResource, router };