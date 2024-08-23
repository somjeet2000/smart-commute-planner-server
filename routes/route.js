const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const dotenv = require('dotenv');
const fetchuser = require('../middleware/fetchuser');
dotenv.config();

// Route 1: Create a ROUTE with POST: /api/v1/routes/create_trip. Login Required.
router.post(
  '/create_trip',
  [
    body('origin')
      .notEmpty()
      .withMessage('Origin Should Not be Empty')
      .isLength({ min: 3 })
      .withMessage('Origin must be atleaset 3 characters long')
      .isString()
      .withMessage('Origin must be a String'),
    body('destination')
      .notEmpty()
      .withMessage('Destination Should Not be Empty')
      .isLength({ min: 3 })
      .withMessage('Destination must be atleaset 3 characters long')
      .isString()
      .withMessage('Destination must be a String'),
    body('timeToLeaveOrigin')
      .isISO8601()
      .withMessage('Time to leave origin must be a valid date'),
    body('timeToLeaveDestination')
      .isISO8601()
      .withMessage('Time to leave destination must be a valid date')
      .custom((value, { request }) => {
        if (new Date(value) <= new Date(request.body.timeToLeaveOrigin)) {
          throw new Error(
            'Time to leave destination must be after time to leave origin'
          );
        }
        return true;
      }),
  ],
  fetchuser,
  (request, response) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
  }
);

module.exports = router;
