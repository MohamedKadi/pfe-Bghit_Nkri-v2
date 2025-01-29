const express = require('express');
const router = express.Router();
const protectMiddleware = require('../middleware/protect.middleware');
const userController = require('../Controllers/userController');

router.route('/').get(userController.getAll);
router
  .route('/:id')
  .get(userController.getOne)
  .delete(protectMiddleware.protectRoute, userController.deleteOne);

module.exports = router;
