const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const {postController} = require('../controllers/');

const router = express.Router();

router.get('/view/:id', postController.view);
router.get('/home', postController.home);
router.get('/popular', postController.popular);
router.get('/recents', postController.recents);
router.get('/topics', postController.topics);
router.post('/store', authMiddleware, postController.store);
router.post('/image/upload', authMiddleware, postController.imageContentUpload);
router.post('/like', authMiddleware, postController.like);
router.put('/update', authMiddleware, postController.update);
router.delete('/destroy', authMiddleware, postController.destroy);

module.exports = router;
