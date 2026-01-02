const express = require('express');
const {postController} = require('../controllers/');

const router = express.Router();

router.get('/view/:id', postController.view);
router.get('/popular', postController.popular);
router.get('/recents', postController.recents);
router.get('/topics', postController.topics);

module.exports = router;

/*
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/profile', authMiddleware, userController.profile);

*/