const { User } = require('../../models');

module.exports = {
  async index(req, res, next) {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (err) {
      next(err);
    }
  }
};
