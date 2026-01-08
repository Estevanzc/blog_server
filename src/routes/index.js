const express = require('express');
const router = express.Router();

router.use('/users', require('./user.routes'));
router.use('/posts', require('./post.routes'));
router.use('/blogs', require('./blog.routes'));

module.exports = router;
