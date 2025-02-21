const express = require('express');
const router = express.Router();
const { createResource } = require('../controllers/resourceController');

router.post('/', createResource);

module.exports = router;