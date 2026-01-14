const jwt = require('jsonwebtoken');
const { User } = require('../../models');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next();
  }

  const [type, token] = authHeader.split(' ');

  if (type !== 'Bearer' || !token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });

    if (user) {
      req.user = user;
    }
  } catch (err) {
  }

  next();
};
