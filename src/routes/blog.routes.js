const express = require('express');
const {blogController, followerController, memberController, postController, memberRequestController } = require('../controllers/');

const router = express.Router();

router.get('/', blogController.index);
router.get('/followers/:id', followerController.blog_followers);
router.get('/members/:id', memberController.blog_members);
router.get('/posts/:id', postController.blog_posts);
router.get('/requests/:id', memberRequestController.blog_requests);
router.post('/store', blogController.store);
router.put('/update/banner', blogController.updateBanner);
router.put('/update/photo', blogController.updatePhoto);
router.put('/update', blogController.update);
router.delete('/destroy', blogController.destroy);

module.exports = router;

/*
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/profile', authMiddleware, userController.profile);

*/