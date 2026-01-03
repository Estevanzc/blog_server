const express = require('express');
const {blogController, followerController, memberController, postController, memberRequestController } = require('../controllers/');

const router = express.Router();

router.get('/', blogController.index);
router.get('/followers/:id', followerController.blog_followers);
router.get('/members/:id', memberController.blog_members);
router.get('/posts/:id', postController.blog_posts);
router.get('/requests/:id', memberRequestController.blog_requests);

module.exports = router;

/*
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/profile', authMiddleware, userController.profile);

*/