const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Available routes
app.use('/api/v1/auth', require('./routes/authentication'));

module.exports = app;
