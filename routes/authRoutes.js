const express = require('express');
const authController = require('../Controllers/authController');
const protect = require('../middleware/protect.middleware');

const router = express.Router();

router.route('/register').post(authController.register);
router.route('/login').post(authController.login);
router.route('/logout').post(authController.logout);

router
  .route('/update-profile')
  .put(protect.protectRoute, authController.updateProfile);

router
  .route('/update-email')
  .post(protect.protectRoute, authController.update_email);

router
  .route('/emailVerification')
  .get(protect.protectRoute, authController.emailVerification);

router
  .route('/updatePassword')
  .post(protect.protectRoute, authController.updatePwd);

router.route('/forgot-password').post(authController.forgotPassword);
router.route('/reset-password').get(authController.resetPassword);

router.route('/checkAuth').get(protect.protectRoute, authController.checkAuth);
module.exports = router;
