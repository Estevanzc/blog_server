const express = require('express');
const {userController, followerController, memberController, postController, memberRequestController} = require('../controllers/');

const router = express.Router();

router.get('/profile/:id', userController.profile);
router.get('/following/:id', followerController.user_following);
router.get('/membering/:id', memberController.user_membering);
router.get('/posts/:id', postController.user_posts);
router.get('/requests/:id', memberRequestController.user_requests);
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