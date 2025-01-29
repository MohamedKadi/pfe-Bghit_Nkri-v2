import mongoose from 'mongoose';

const { Schema } = mongoose;

const postSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Post should have a title'],
    validate: {
      validator: function (value) {
        return value.length > 5 && value.length < 100;
      },
      message:
        "Post title should have at least 5 character's and max 100 character's",
    },
    required: true,
  },
  description: {
    type: String,
    validate: {
      validator: function (value) {
        return value > 100;
      },
      message: "Post description should have at least 100 character's",
    },
    required: [true, 'Post should have a description'],
  },
  location: {
    type: String,
    required: [true, 'Post should have a location'],
  },
  price: {
    type: Number,
    required: [true, 'Post should have a price'],
  },
  imageUrls: {
    type: [String],
    validate: {
      validator: function (value) {
        // Ensure at least 3 URLs are provided
        return value.length >= 3;
      },
      message: 'Post should have at least 3 images',
    },
    required: [true, 'Post must have image URLs'],
  },
  availability: {
    type: Boolean,
  },
  house_type: {
    type: String,
    enum: ['ville', 'appartement'],
    required: [true, 'Post must have a type'],
  },
  maxPersons: {
    type: Number,
    enum: [1, 2, 3, 4, 5, 6],
    required: [true, 'Post must have a number of persons'],
  },
  bedrooms: {
    type: Number,
    enum: [1, 2, 3, 4, 5, 6],
    required: [true, 'Post must have a number of persons'],
  },
  bathrooms: {
    type: Number,
    enum: [1, 2, 3, 4, 5, 6],
    required: [true, 'Post must have a number of persons'],
  },
  furnished: {
    type: Boolean,
    required: [true, 'the user should know if the house is furnished'],
  },
  amenties: [
    {
      type: String,
      enum: ['electricity', 'water', 'Wifi', 'Tv'],
    },
  ],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived', 'pending_approval', 'rejected'],
    default: 'draft',
  },
  contact_info: {
    type: String,
    required: [true, 'Les informations de contact sont obligatoires'],
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  Reviews: {
    type: Schema.Types.ObjectId,
    ref: 'Review',
  },
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
