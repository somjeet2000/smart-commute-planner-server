const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();
const MONGO_URI = process.env.MONGO_URL;

const connectToMongo = () => {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log('Success: MongoDB Connected');
    })
    .catch((error) => {
      console.log('Error while connecting MongoDB: ' + error);
    });
};

module.exports = connectToMongo;
