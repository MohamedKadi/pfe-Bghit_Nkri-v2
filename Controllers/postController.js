const { isValidObjectId } = require('mongoose');
const Post = require('../models/Post');
const User = require('../models/User');

exports.getAllPublished = async (req, res, next) => {
  try {
    const {
      location,
      minPrice,
      maxPrice,
      house_type,
      availability,
      maxPersons,
      bedrooms,
      bathrooms,
      furnished,
      amenties,
      startDate,
      endDate,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    const filterObject = {};

    if (location) filterObject.location = location.toLowerCasse();

    if (minPrice) filterObject.price.$gte = Number(minPrice);
    if (maxPrice) filterObject.price.$lte = Number(maxPrice);

    if (house_type) filterObject.house_type = house_type;
    if (availability) filterObject.availability = availability === 'true';
    if (maxPersons) filterObject.maxPersons = Number(maxPersons);
    if (bedrooms) filterObject.bedrooms = Number(bedrooms);
    if (bathrooms) filterObject.bathrooms = Number(bathrooms);
    if (furnished) filterObject.furnished = furnished === 'true';
    if (amenties) filterObject.amenties = { $all: amenties.split(', ') };

    filterObject.status = 'published';

    if (startDate) filterObject.dateCreated.$gte = new Date(startDate);
    if (endDate) filterObject.dateCreated.$lte = new Date(endDate);

    const sortObject = {};
    if (sort) {
      sortArray = sort.split(', ');
      sortArray.forEach((element) => {
        if (element.startsWith('-')) {
          sortObject[element.slice(1)] = -1;
        } else {
          sortObject[element.slice(1)] = 1;
        }
      });
    }

    const skip = (Number(page) - 1) * limit;

    const posts = await Post.find(filterObject)
      .sort(sortObject)
      .skip(skip)
      .limit(Number(limit))
      .populate('Reviews');

    res.status(200).json({
      length: posts.length,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      const noIdError = new Error('No id provided for post');
      noIdError.status = 'fail to get the post without the id';
      noIdError.statusCode = 401;
      return next(noIdError);
    }
    if (!isValidObjectId(id)) {
      const IdError = new Error('not found this post');
      IdError.status = 'this post id does not exists';
      IdError.statusCode = 404;
      return next(IdError);
    }

    const post = await Post.findOne({ _id: id, status: 'published' }).populate(
      'Reviews'
    );
    res.status(200).json({
      data: post,
    });
  } catch (error) {
    next(error);
  }
};
//posts for a specific user
exports.getAllPublishedUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id === req.user._id) {
      return exports.getAllSpecificUser(req, res, next);
    }
    const user = await User.findById(id).populate({
      path: 'posts',
      match: { status: 'published' },
    });
    res.status(200).json({
      postsLength: user.posts.length,
      //data: user,
      posts: user.posts,
    });
  } catch (error) {
    next(error);
  }
};
//get posts of the current user soit kant published ola draft ola rejected etc
exports.getAllSpecificUser = async (req, res, next) => {
  try {
    const { _id } = req.user;
    let { status } = req.query;
    if (!status) {
      status = 'published';
    }
    const statusArray = [
      'draft',
      'published',
      'archived',
      'pending_approval',
      'rejected',
    ];
    if (!statusArray.includes(status)) {
      const statusError = new Error(
        'statusError you should only chose the choices that you have'
      );
      statusError.status = 'fail to get the posts';
      statusError.statusCode = 400;
      return next(statusError);
    }
    const user = await User.findById(_id).populate({
      path: 'posts',
      match: { status },
    });
    res.status(200).json({
      postsLength: user.posts.length,
      //data: user,
      posts: user.posts,
    });
  } catch (error) {
    next(error);
  }
};
//creating a post
exports.createOne = async (req, res, next) => {
  try {
    const {
      title,
      description,
      location,
      price,
      imageUrls,
      availability,
      house_type,
      maxPersons,
      bedrooms,
      bathrooms,
      furnished,
      amenties,
      status,
      contact_info,
    } = req.body;
    const { _id } = req.user;

    if (status && (status === 'published' || status === 'rejected')) {
      published = 'pending_approval';
    }

    const post = await Post.create({
      title,
      description,
      location,
      price,
      imageUrls,
      availability,
      house_type,
      maxPersons,
      bedrooms,
      bathrooms,
      furnished,
      amenties,
      status,
      contact_info,
      createdBy: _id,
    });
    req.user.posts.push(post._id);
    await req.user.save();

    res.status(201).json({
      post: post,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateOne = async (req, res, next) => {
  try {
    const {
      title,
      description,
      location,
      price,
      imageUrls,
      availability,
      house_type,
      maxPersons,
      bedrooms,
      bathrooms,
      furnished,
      amenties,
      status,
      contact_info,
    } = req.body;

    const updatedObject = {};
    if (title) updatedObject.title = title;
    if (description) updatedObject.description = description;
    if (location) updatedObject.location = location.toLowerCasse();
    if (price) updatedObject.price = Number(minPrice);
    if (imageUrls) updatedObject.imageUrls = imageUrls;
    if (house_type) updatedObject.house_type = house_type;
    if (availability) updatedObject.availability = availability === 'true';
    if (maxPersons) updatedObject.maxPersons = Number(maxPersons);
    if (bedrooms) updatedObject.bedrooms = Number(bedrooms);
    if (bathrooms) updatedObject.bathrooms = Number(bathrooms);
    if (furnished) updatedObject.furnished = furnished === 'true';
    if (amenties) updatedObject.amenities = amenties;
    if (status) updatedObject.status = status;
    if (contact_info) updatedObject.contact_info = contact_info;

    const updatedPost = await Post.findByIdAndUpdate(
      req.user._id,
      updatedObject,
      { new: true }
    );

    res.status(200).json({
      message: 'updated successfully',
      updatedPost: updatedPost,
    });
  } catch (error) {
    next(error);
  }
};
