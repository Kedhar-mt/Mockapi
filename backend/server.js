const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const projectRoutes = require('./routes/projectRoutes');
const resourceRoutes = require('./routes/resourceRoutes'); // Update the import
const getFakerLabels = require('./controllers/fakerController')

dotenv.config();
connectDB();

const app = express();
app.use(cors({
    origin: ['https://mockapi-frontend.onrender.com'], // Allow only your frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }));  
app.use(express.json());

app.use('/api/projects', projectRoutes);
app.use('/api/resources', resourceRoutes); // Register resource routes
app.use('/faker-labels', getFakerLabels);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));