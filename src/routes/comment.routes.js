const express = require('express');
const { commentController } = require('../controllers');

const router = express.Router();

router.post('/store', commentController.store);
router.put('/update', commentController.update);
router.delete('/destroy', commentController.destroy);

module.exports = router;

/*
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/profile', authMiddleware, userController.profile);

*/