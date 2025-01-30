const { isValidObjectId } = require('mongoose');
const Post = require('../models/Post');
const User = require('../models/User');

exports.getAll = async (req, res, next) => {
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
      status,
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
    if (status) filterObject.status = status;

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
      .limit(Number(limit));

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

    const post = await Post.findOne({ _id: id });
    res.status(200).json({
      data: post,
    });
  } catch (error) {
    next(error);
  }
};
//posts for a specific user
exports.getAllUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate('posts');
    // const selectedPosts = await posts.populate('posts');
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
    const user = await req.user.save();

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
