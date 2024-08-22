const express = require('express');
const router = express.Router();
const Users = require('../models/Users');
const { body, validationResult } = require('express-validator');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
dotenv.config();

JWT_SECRET = process.env.JWT_SIGN;

// Route 1: Create a user using POST: /api/v1/auth/create_user. No Login required.
router.post(
  '/create_user',
  [
    // Name must not be empty
    body('name', 'Name should not be empty').notEmpty(),
    // Email must be an email and not empty
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .notEmpty()
      .withMessage('Email should not be empty'),
    // Password must be of 8 characters and not empty
    body('password')
      .notEmpty()
      .withMessage('Password should not be empty')
      .isLength({ min: 8 })
      .withMessage('Password must be atleast of 8 characters'),
  ],
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, email, password } = req.body;
      let isValid = false;

      // Check if email already exists
      let user = await Users.findOne({ email });
      if (user) {
        return res.status(400).json({
          isValid,
          error:
            'User with this email already exists. Please enter an unique email',
        });
      }

      // If email doesn't exists, the below code will run
      /* Both the bcrypt.genSalt and bcrypt.hash returns a promise, we need to use await as a must */
      const salt = await bcrypt.genSalt(10);
      const securePassword = await bcrypt.hash(password, salt);

      user = await Users.create({
        name: name,
        email: email,
        password: securePassword,
      });

      // Create JWT Token after the user has been created.
      const payload = {
        userID: { id: user.id },
      };
      const authToken = jwt.sign(payload, JWT_SECRET);

      isValid = true;
      res.status(200).json({ isValid, authToken });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Internal Server Error', error: error.message });
    }
  }
);

// Route 2: Login a user with POST: /api/v1/auth/login_user. No Login Required
router.post(
  '/login_user',
  [
    // Email should be email and not empty
    body('email')
      .isEmail()
      .withMessage('Please enter an valid email')
      .notEmpty()
      .withMessage('Email should not be empty'),
    // Password must be atleast of 8 characters and not empty
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be atleast of 8 characters')
      .notEmpty()
      .withMessage('Password should not be empty'),
  ],
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      let isValid = false;

      // Check if the email exists in the database
      const user = await Users.findOne({ email });
      if (!user) {
        return res
          .status(401)
          .json({ isValid, message: 'Invalid Credentials' });
      }

      // Compare the user given password and the password saved in the database
      // Use of await is mandatory below otherwise, it will allow user to login with any password
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(401)
          .json({ isValid, message: 'Invalid Credentials' });
      }

      // If both the above conditions comes true, then the below code will run
      // Create a JWT Token
      const payload = {
        userID: { id: user.id },
      };

      const authToken = jwt.sign(payload, JWT_SECRET);
      isValid = true;
      res.status(200).json({ isValid, authToken });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Internal Server Error', error: error.message });
    }
  }
);

// Route 3: Get information about the current user with GET: /api/v1/auth/get_current_user. Login Required.
router.get('/get_current_user', fetchuser, async (req, res) => {
  try {
    const userID = req.user.id;
    const user = await Users.findById(userID).select('-password');
    res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Internal Server Error', error: error.message });
  }
});

module.exports = router;
