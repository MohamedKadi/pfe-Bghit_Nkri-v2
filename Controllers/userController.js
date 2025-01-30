const { isValidObjectId } = require('mongoose');
const User = require('../models/User');

exports.getAll = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).json({
      length: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      const noIdError = new Error('No id provided for the user');
      noIdError.status = 'fail to get the user without the id';
      noIdError.statusCode = 401;
      return next(noIdError);
    }
    const user = await User.findOne({ _id: id }).select(
      '-_id name email isVerified dateCreated'
    );
    if (!user) {
      const noUserError = new Error('No user found');
      noUserError.status = 'No user with this id';
      noUserError.statusCode = 404;
      return next(noUserError);
    }
    res.status(200).json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      const idError = new Error('this id does not exists');
      idError.status = 'fail to delete';
      idError.statusCode = 404;
      return next(idError);
    }
    const deleted = await User.findByIdAndDelete(id);
    res.status(200).json({
      message: 'the user got deleted successfully',
      user: deleted,
    });
  } catch (error) {
    next(error);
  }
};
