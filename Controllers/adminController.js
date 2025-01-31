const Post = require('../models/Post');
const User = require('../models/User');

exports.pendingPosts = async (req, res, next) => {
  try {
    const { _id, role } = req.user;
    if (role !== 'admin') {
      const StatusError =
        'unauthorized access its specilized place for only admins';
      StatusError.status = 'fail to update status';
      StatusError.statusCode = 401;
      return next(StatusError);
    }
    const pendingPosts = await Post.find({ status: 'pending_approval' });
    res.status(200).json({
      data: pendingPosts,
    });
  } catch (error) {
    next(error);
  }
};

exports.changeStatusPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const post = await Post.findById(id);
    if (!post) {
      const postError = new Error('No post found');
      postError.status = 'fail to update status for the post';
      postError.statusCode = 404;
      return next(postError);
    }
    if (!status) {
      const StatusError = 'no status provided';
      StatusError.status = 'fail to update status';
      StatusError.statusCode = 400;
      return next(StatusError);
    }
    const statusArray = ['published', 'rejected'];
    if (!statusArray.includes(status)) {
      const statusError = new Error(
        'statusError you should only chose the choices that you have'
      );
      statusError.status = 'fail to update the posts';
      statusError.statusCode = 400;
      return next(statusError);
    }
    const updatedPost = await Post.findByIdAndUpdate(id, { status: status });
    res.status(200).json({
      updatedPost: updatedPost,
    });
  } catch (error) {
    next(error);
  }
};

exports.changeStatusUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      const userError = 'no user found';
      userError.status = 'fail to update status for the user';
      userError.statusCode = 400;
      return next(userError);
    }
    const { status } = req.body;
    if (!status) {
      const StatusError = 'no status provided';
      StatusError.status = 'fail to update status';
      StatusError.statusCode = 400;
      return next(StatusError);
    }
    const statusArray = ['published', 'rejected'];
    if (!statusArray.includes(status)) {
      const statusError = new Error(
        'statusError you should only chose the choices that you have'
      );
      statusError.status = 'fail to update the posts';
      statusError.statusCode = 400;
      return next(statusError);
    }
    const updatedPost = await user.findByIdAndUpdate(id, { status });
    res.status(200).json({
      updatedPost: updatedPost,
    });
  } catch (error) {
    next(error);
  }
};
