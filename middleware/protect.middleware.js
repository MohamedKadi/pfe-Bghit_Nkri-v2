const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      const NoData = new Error('Unauthorized - No Token Provided');
      NoData.status = 'token invalid';
      NoData.statusCode = 401;
      return next(NoData);
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (!decoded) {
      const NoData = new Error('Unauthorized - No Token Provided');
      NoData.status = 'token invalid';
      NoData.statusCode = 401;
      return next(NoData);
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      const NoData = new Error('no user found with that token');
      NoData.status = 'token invalid';
      NoData.statusCode = 401;
      return next(NoData);
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
