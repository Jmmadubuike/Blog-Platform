const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Get token from header
  const token = req.header('Authorization');

  // Check if token is missing
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify the token (Ensure the token follows "Bearer <token>" format)
    const tokenParts = token.split(' ');

    if (tokenParts[0] !== 'Bearer' || tokenParts.length !== 2) {
      return res.status(401).json({ msg: 'Token is not valid, format should be "Bearer <token>"' });
    }

    const decoded = jwt.verify(tokenParts[1], process.env.JWT_SECRET);

    // Attach the decoded user information to the request object
    req.user = decoded.user;

    // Proceed to the next middleware
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
