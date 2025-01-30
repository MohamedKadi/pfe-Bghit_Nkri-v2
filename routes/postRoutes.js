const express = require('express');
const router = express.Router();
const postController = require('../Controllers/postController');

router.route('/').get(postController.getAll).post(postController.createOne);
router.route('/:id').get(postController.getOne).patch(postController.updateOne);
router.route('/user/:id').get(postController.getAllUser);

module.exports = router;
