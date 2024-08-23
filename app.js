const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const APP_VERSION = process.env.APP_VERSION;

const app = express();
app.use(cors());
app.use(express.json());

// Available routes
app.use(`/api/${APP_VERSION}/auth`, require('./routes/authentication'));
app.use(`/api/${APP_VERSION}/route`, require('./routes/route'));

module.exports = app;
