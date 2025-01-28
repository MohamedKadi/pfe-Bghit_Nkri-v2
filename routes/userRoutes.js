const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');

router.route('/').get(userController.all);

module.exports = router;
