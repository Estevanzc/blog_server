const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const optionalAuthMiddleware = require('../middlewares/optionalAuthMiddleware');
const {userController, followerController, memberController, postController, memberRequestController, notificationController, preferenceController, searchController} = require('../controllers/');

const router = express.Router();

router.get('/profile/:id', userController.profile);
router.get('/following/:id', followerController.user_following);
router.get('/membering/:id', memberController.user_membering);
router.get('/posts/:id', postController.user_posts);
router.get('/requests/:id', memberRequestController.user_requests);
router.get('/notifications/:id', authMiddleware, notificationController.user_notifications);
router.get('/searches', optionalAuthMiddleware, searchController.user_searches);
router.get('/dark', authMiddleware, userController.dark_mode);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/preferences/store', authMiddleware, preferenceController.store);
router.put('/update/photo', authMiddleware, userController.updatePhoto);
router.put('/update/banner', authMiddleware, userController.updateBanner);
router.put('/update', authMiddleware, userController.update);
router.delete('/notifications/destroy/all', authMiddleware, notificationController.destroyAll);
router.delete('/notifications/destroy/:id', authMiddleware, notificationController.destroy);
router.delete('/:id', authMiddleware, userController.destroy);

module.exports = router;
