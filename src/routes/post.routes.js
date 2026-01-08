const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const {postController, commentController} = require('../controllers/');

const router = express.Router();

router.get('/view/:id', postController.view);
router.get('/home', postController.home);
router.get('/popular', postController.popular);
router.get('/recents', postController.recents);
router.get('/topics', postController.topics);
router.post('/comments/store', authMiddleware, commentController.store);
router.post('/store', authMiddleware, postController.store);
router.post('/image/upload', authMiddleware, postController.imageContentUpload);
router.post('/like/:id', authMiddleware, postController.like);
router.put('/update', authMiddleware, postController.update);
router.put('/comments/update', authMiddleware, commentController.update);
router.delete('/comments/destroy/:id', authMiddleware, commentController.destroy);
router.delete('/destroy/:id', authMiddleware, postController.destroy);

module.exports = router;
