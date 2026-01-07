const express = require('express');
const {postController} = require('../controllers/');

const router = express.Router();

router.get('/view/:id', postController.view);
router.get('/home', postController.home);
router.get('/popular', postController.popular);
router.get('/recents', postController.recents);
router.get('/topics', postController.topics);
router.post('/store', postController.store);
router.post('/image/upload', postController.imageContentUpload);
router.post('/like', postController.like);
router.put('/update', postController.update);
router.delete('/destroy', postController.destroy);

module.exports = router;

/*
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/profile', authMiddleware, userController.profile);
*/