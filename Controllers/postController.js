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
      amenities,
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
    if (amenities) filterObject.amenities = { $all: amenities.split(', ') };
    if (status) filter.status = status;

    if (startDate) filter.dateCreated.$gte = new Date(startDate);
    if (endDate) filter.dateCreated.$lte = new Date(endDate);

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
