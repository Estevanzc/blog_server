module.exports = ({
  param = 'id',
  allowAdmin = false,
  allowSelf = false
} = {}) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const targetUserId = Number(req.params[param]);
    if (allowAdmin && req.user.admin === true) {
      return next();
    }
    if (allowSelf && req.user.id === targetUserId) {
      return next();
    }
    return res.status(403).json({ error: 'Forbidden' });
  };
};
