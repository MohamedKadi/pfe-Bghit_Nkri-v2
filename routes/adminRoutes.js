const express = require('express');
const router = express.Router();
const adminController = require('../Controllers/adminController');

router.route('/posts').get(adminController.pendingPosts);
router.route('/status-post/:id').post(adminController.changeStatusPost);
router.route('/status-user/:id').post(adminController.changeStatusUser);

module.exports = router;
