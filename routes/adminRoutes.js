const express = require('express');
const router = express.Router();
const adminController = require('../Controllers/adminController');
const protect = require('../middleware/protect.middleware');

router
  .route('/posts')
  .get(protect.protectRouteAdmin, adminController.pendingPosts);
router
  .route('/status-post/:id')
  .post(protect.protectRouteAdmin, adminController.changeStatusPost);
router
  .route('/status-user/:id')
  .post(protect.protectRouteAdmin, adminController.changeStatusUser);

module.exports = router;
