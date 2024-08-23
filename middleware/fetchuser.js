const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SIGN;

const fetchuser = (req, res, next) => {
  // Task: Get the token from the JWT Token and Add ID to the request object.

  // Get the token
  const token = req.header('auth-token');
  if (!token) {
    return res.status(401).json({ error: 'Invalid Token' });
  }

  try {
    // Verify if the token is correct and store the response into userData
    const data = jwt.verify(token, JWT_SECRET);
    // Add it to request object
    /* Always remember the object details when we send the data as JWT Token */
    req.user = data.userID;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: 'Unauthorized User', error: error.message });
  }
};

module.exports = fetchuser;
