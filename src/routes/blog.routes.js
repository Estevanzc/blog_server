const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const {blogController, followerController, memberController, memberRequestController, postController } = require('../controllers/');

const router = express.Router();

router.get('/followers/:id', followerController.blog_followers);
router.get('/members/:id', memberController.blog_members);
router.get('/posts/:id', postController.blog_posts);
router.get('/requests/:id', authMiddleware, memberRequestController.blog_requests);
router.post('/members/request/send/:id', authMiddleware, memberRequestController.store);
router.post('/members/request/accept/:id', authMiddleware, memberController.store);
router.post('/follow/:id', authMiddleware, followerController.follow);
router.post('/store', authMiddleware, blogController.store);
router.put('/update/banner', authMiddleware, blogController.updateBanner);
router.put('/update/photo', authMiddleware, blogController.updatePhoto);
router.put('/update', authMiddleware, blogController.update);
router.delete('/destroy/:id', authMiddleware, blogController.destroy);
router.delete('/members/destroy/:id', authMiddleware, memberController.destroy);
router.get('/:id', blogController.index);

module.exports = router;
