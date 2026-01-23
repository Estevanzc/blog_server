const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const optionalAuthMiddleware = require('../middlewares/optionalAuthMiddleware');
const {postController, commentController, searchController} = require('../controllers/');

const router = express.Router();

router.get('/view/:id', optionalAuthMiddleware, postController.view);
router.get('/search/:search_str', optionalAuthMiddleware, searchController.search);
router.get('/home', postController.home);
router.get('/popular', postController.popular);
router.get('/recents', postController.recents);
router.get('/topics', postController.topics);
router.get('/list/trending', postController.trendingPosts);
router.get('/list/recents', postController.recentPosts);
router.get('/list/following/:id', postController.following_posts);
router.get('/list/keyword/:id', postController.keywordPosts);
router.get('/list/history/:id', postController.postHistory);
router.post('/comments/store', authMiddleware, commentController.store);
router.post('/store', authMiddleware, postController.store);
router.post('/image/upload', authMiddleware, postController.imageContentUpload);
router.post('/like/:id', authMiddleware, postController.like);
router.put('/update', authMiddleware, postController.update);
router.put('/comments/update', authMiddleware, commentController.update);
router.delete('/comments/destroy/:id', authMiddleware, commentController.destroy);
router.delete('/destroy/:id', authMiddleware, postController.destroy);

module.exports = router;
