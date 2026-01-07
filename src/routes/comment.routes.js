const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { commentController } = require('../controllers');

const router = express.Router();

router.post('/store', authMiddleware, commentController.store);
router.put('/update', authMiddleware, commentController.update);
router.delete('/destroy', authMiddleware, commentController.destroy);

module.exports = router;
