const Project = require('../models/Project');
const express = require('express');
const router = express.Router();
const { faker } = require('@faker-js/faker');

const createProject = async (req, res) => {
  const { name } = req.body;
  try {
    const newProject = new Project({ name, resources: [] });
    await newProject.save();

    const endpoint = `/api/projects/${newProject.name.toLowerCase().replace(/\s+/g, '-')}`;

    router.get(endpoint, async (req, res) => {
      try {
        const project = await Project.findById(newProject._id);
        if (!project) {
          return res.status(404).json({ message: 'Project not found' });
        }

        const formattedResources = {};
        project.resources.forEach(resource => {
          formattedResources[resource.label] = resource.value;
        });

        res.json({
          message: `This is the API endpoint for project ${project.name}`,
          data: {
            id: project._id,
            name: project.name,
            resources: formattedResources
          },
        });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });

    res.status(201).json({
      ...newProject.toObject(),
      endpoint: `http://localhost:5000${endpoint}`,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProjectByName = async (req, res) => {
    const { name } = req.params;
    try {
      // Find all projects with the given name
      const projects = await Project.find({ name: name });
      if (!projects || projects.length === 0) {
        return res.status(404).json({ message: 'Project not found' });
      }
  
      // Format the response for all projects
      const formattedProjects = projects.map(project => {
        const formattedResources = {};
        project.resources.forEach(resource => {
          formattedResources[resource.label] = resource.value;
        });
  
        return {
          id: project._id,
          name: project.name,
          resources: formattedResources
        };
      });
  
      res.json({
        data: formattedProjects,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

/*const addResource = async (req, res) => {
  const { projectId, label, type } = req.body;
  
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    let randomData;
    switch (type.toLowerCase()) {
      case 'integer':
        randomData = faker.number.int({ min: 1, max: 100 });
        break;
      case 'string':
        randomData = faker.lorem.word();
        break;
      case 'boolean':
        randomData = faker.datatype.boolean();
        break;
      default:
        randomData = faker.lorem.word();
    }

    project.resources.push({
      label,
      value: randomData,
    });

    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};*/

const getRandomStringByLabel = (label) => {
  switch (label.toLowerCase()) {
    case 'username':
      return faker.internet.userName();
    case 'useragent':
      return faker.internet.userAgent();
    case 'animal':
      return faker.animal.type();
    case 'city':
      return faker.address.cityName();
    case 'first name':
      return faker.name.firstName();
    case 'last name':
      return faker.name.lastName();
    case 'email':
      return faker.internet.email();
    default:
      return faker.lorem.word(); // Default to a random word if label is not recognized
  }
};

const addResource = async (req, res) => {
  const { projectId, label, type, nestedResource } = req.body;
  
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    let resourceValue;
    
    if (type === 'object' && nestedResource) {
      // Handle nested object
      resourceValue = {
        name: nestedResource.name,
        ...nestedResource.fields
      };
    } else {
      // Handle primitive types
      switch (type.toLowerCase()) {
        case 'integer':
          resourceValue = faker.number.int({ min: 1, max: 100 });
          break;
        case 'string':
          resourceValue = getRandomStringByLabel(label);
          break;
        case 'boolean':
          resourceValue = faker.datatype.boolean();
          break;
        default:
          resourceValue = faker.lorem.word();
      }
    }

    project.resources.push({
      label,
      value: resourceValue,
      nestedResource: type === 'object' ? resourceValue : null
    });

    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateResource = async (req, res) => {
  const { projectId, resourceId, value } = req.body;
  
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const resource = project.resources.id(resourceId);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    resource.value = value;
    await project.save();
    res.status(200).json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteResource = async (req, res) => {
  const { projectId, resourceId } = req.params;
  
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const resourceIndex = project.resources.findIndex(resource => resource.id === resourceId);
    if (resourceIndex === -1) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    project.resources.splice(resourceIndex, 1);
    await project.save();
    res.status(200).json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


const addNewData = async (req, res) => {
  const { projectId, count = 1 } = req.body;
  
  try {
    // Find the source project
    const sourceProject = await Project.findById(projectId);
    if (!sourceProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Create multiple new projects
    const newProjects = [];
    for (let i = 0; i < count; i++) {
      const newProject = new Project({
        name: sourceProject.name,
        resources: sourceProject.resources.map(resource => {
          let randomValue;
          if (typeof resource.value === 'number') {
            randomValue = faker.number.int({ min: 1, max: 100 });
          } else if (typeof resource.value === 'boolean') {
            randomValue = faker.datatype.boolean();
          } else {
            randomValue = faker.lorem.word();
          }
          
          return {
            label: resource.label,
            value: randomValue
          };
        })
      });
      
      newProjects.push(newProject);
    }
    
    // Save all new projects
    await Promise.all(newProjects.map(project => project.save()));
    
    // Return all projects with this name including the new ones
    const allProjects = await Project.find({ name: sourceProject.name });
    res.status(201).json(allProjects);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ... rest of the controller code remains the same

const deleteEntry = async (req, res) => {
    const { entryId } = req.params;
    
    try {
      const deletedProject = await Project.findByIdAndDelete(entryId);
      if (!deletedProject) {
        return res.status(404).json({ message: 'Entry not found' });
      }
      res.status(200).json({ message: 'Entry deleted successfully' });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

const updateProjectName = async (req, res) => {
    const { projectId, newName } = req.body;
  
    try {
      // Find all projects with the same original name
      const targetProject = await Project.findById(projectId);
      if (!targetProject) {
        return res.status(404).json({ message: 'Project not found' });
      }
  
      // Find all projects with the same original name
      const relatedProjects = await Project.find({ name: targetProject.name });
  
      // Update the name for all related projects
      await Promise.all(
        relatedProjects.map(project => {
          project.name = newName;
          return project.save();
        })
      );
  
      // Fetch all updated projects to return in response
      const updatedProjects = await Project.find({ _id: { $in: relatedProjects.map(p => p._id) } });
      res.status(200).json(updatedProjects);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  
const updateResourceLabel = async (req, res) => {
    const { projectId, resourceId, newLabel } = req.body;
  
    try {
      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
  
      const resource = project.resources.id(resourceId);
      if (!resource) {
        return res.status(404).json({ message: 'Resource not found' });
      }
  
      resource.label = newLabel;
      await project.save();
      res.status(200).json(project);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
const addResourceToAll = async (req, res) => {
    const { projectName, label, type } = req.body;
    
    try {
      // Find all projects with the same name
      const projects = await Project.find({ name: projectName });
      if (!projects || projects.length === 0) {
        return res.status(404).json({ message: 'Projects not found' });
      }
  
      // Generate random values based on type for each project
      await Promise.all(projects.map(async (project) => {
        let randomData;
        switch (type.toLowerCase()) {
          case 'integer':
            randomData = faker.number.int({ min: 1, max: 100 });
            break;
          case 'string':
            randomData = faker.lorem.word();
            break;
          case 'boolean':
            randomData = faker.datatype.boolean();
            break;
          default:
            randomData = faker.lorem.word();
        }
  
        project.resources.push({
          label,
          value: randomData,
        });
  
        await project.save();
      }));
  
      // Fetch and return updated projects
      const updatedProjects = await Project.find({ name: projectName });
      res.status(200).json(updatedProjects);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
const deleteProject = async (req, res) => {
    const { projectName } = req.params;
    
    try {
      // Delete all projects with the given name
      const result = await Project.deleteMany({ name: projectName });
      
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Project not found' });
      }
      
      res.status(200).json({ message: 'Project and all entries deleted successfully' });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
const deleteResourceFromAll = async (req, res) => {
    const { projectName, resourceLabel } = req.params;
    
    try {
      // Find all projects with the given name
      const projects = await Project.find({ name: projectName });
      if (!projects || projects.length === 0) {
        return res.status(404).json({ message: 'Projects not found' });
      }
  
      // Remove the resource with matching label from each project
      await Promise.all(projects.map(async (project) => {
        project.resources = project.resources.filter(resource => resource.label !== resourceLabel);
        await project.save();
      }));
  
      // Fetch and return updated projects
      const updatedProjects = await Project.find({ name: projectName });
      res.status(200).json(updatedProjects);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
const getFakerLabels = (req, res) => {
    const fakerCategories = Object.keys(faker).reduce((acc, category) => {
      if (typeof faker[category] === 'object') {
        acc[category] = Object.keys(faker[category]).filter(method => typeof faker[category][method] === 'function');
      }
      return acc;
    }, {});
  
    res.json(fakerCategories);
  };
  
module.exports = { createProject, getProjects, getProjectByName, addResource, updateResource, deleteResource,addNewData,deleteEntry,updateProjectName,updateResourceLabel,addResourceToAll,deleteProject,deleteResourceFromAll,getFakerLabels,router };