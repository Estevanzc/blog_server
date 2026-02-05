const router = require('express').Router();
const { sequelize } = require('../../models');

if (process.env.NODE_ENV === 'test') {
  router.post('/__reset', async (req, res) => {
    await sequelize.sync({ force: true });
    res.sendStatus(204);
  });
}

module.exports = router;
