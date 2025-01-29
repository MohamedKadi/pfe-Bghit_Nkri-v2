import mongoose from 'mongoose';
const { Schema } = mongoose;

const reviewSchema = new Schema({
  rating: {
    type: Number,
    required: [true, 'La note est obligatoire'],
    min: [1, 'La note minimale est 1'],
    max: [5, 'La note maximale est 5'],
  },
  comment: {
    type: String,
    trim: true,
    maxlength: [500, 'Le commentaire ne doit pas dépasser 500 caractères'],
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "L'utilisateur est obligatoire"],
  },
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
