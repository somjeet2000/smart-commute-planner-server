const connectToMongo = require('./config/database');
const express = require('express');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config();
connectToMongo();
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Smart Commute Planner server listening on port ${port}`);
});

//Test the API
app.get('/', (req, res) => {
  res.status(200).json({ message: 'API is running...' });
});

//Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Everything is good here 👀' });
});
