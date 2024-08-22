const connectToMongo = require('./config/database');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
connectToMongo();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

// Available routes
app.use('/api/v1/auth', require('./routes/authentication'));

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
