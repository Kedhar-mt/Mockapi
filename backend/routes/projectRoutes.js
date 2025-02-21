const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectByName,
  addResource,
  updateResource,
  deleteResource,
  deleteEntry,
  addNewData,
  updateProjectName,
  updateResourceLabel,
  addResourceToAll,
  deleteProject,
  deleteResourceFromAll,
  getFakerLabels,
} = require('../controllers/projectController');
//const fakerController = require('../controllers/fakerController');

// Define the routes
router.post('/', createProject);
router.get('/', getProjects);
router.get('/:name', getProjectByName);
router.post('/add-resource', addResource);
router.put('/update-resource', updateResource);
router.delete('/delete-resource/:projectId/:resourceId', deleteResource);
router.delete('/delete-entry/:entryId', deleteEntry);
router.post('/add-new-data', addNewData);
router.put('/update-project-name', updateProjectName);
router.put('/update-resource-label', updateResourceLabel);
router.post('/add-resource-to-all', addResourceToAll);
router.delete('/delete-project/:projectName', deleteProject);
router.delete('/delete-resource-from-all/:projectName/:resourceLabel', deleteResourceFromAll);
router.get('/faker-labels', getFakerLabels);

module.exports = router;