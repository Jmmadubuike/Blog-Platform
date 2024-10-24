const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {

  const token = req.header('Authorization');


  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {

    const tokenParts = token.split(' ');

    if (tokenParts[0] !== 'Bearer' || tokenParts.length !== 2) {
      return res.status(401).json({ msg: 'Token is not valid, format should be "Bearer <token>"' });
    }

    const decoded = jwt.verify(tokenParts[1], process.env.JWT_SECRET);


    req.user = decoded.user;


    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
