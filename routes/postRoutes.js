const express = require('express');
const router = express.Router();
const postController = require('../Controllers/postController');

router.route('/').get(postController.getAll);
router.route('/:id').get(postController.getOne);
router.route('/user/:id').get(postController.getAllUser);

module.exports = router;
