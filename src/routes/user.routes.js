const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/profile/:id', userController.profile);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.put('/update/photo', userController.updatePhoto);
router.put('/update/banner', userController.updateBanner);
router.put('/update', userController.update);
router.delete('/:id', userController.destroy);

module.exports = router;

/*
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/profile', authMiddleware, userController.profile);
*/