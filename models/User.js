const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Le nom est obligatoire'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "L'email est obligatoire"],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return validator.isEmail(v);
      },
      message: (props) => `${props.value} n'est pas un email valide!`,
    },
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est obligatoire'],
    minlength: [8, 'Le mot de passe doit contenir au moins 8 caractères'],
  },
  phoneNumber: {
    type: String,
    validate: {
      validator: function (v) {
        return validator.isMobilePhone(v, 'ar-MA');
      },
      message: (props) =>
        `${props.value} n'est pas un numéro de téléphone valide!`,
    },
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  profilePic: {
    type: String,
    default: 'default_profile_pic.jpg',
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['actif', 'banni'],
    default: 'actif',
  },
});

userSchema
  .virtual('confirmedPwd')
  .get(function () {
    return this._confirmedPwd;
  })
  .set(function (value) {
    this._confirmedPwd = value;
  });

userSchema.pre('save', function (next) {
  if (this.password !== this._confirmedPwd) {
    const error = new Error('Password and confirmed password do not match.');
    error.status = 'inputs error';
    error.statusCode = 400;
    return next(error);
  }
  next();
});

userSchema.methods.comparePwds = function (pwd) {
  return bcrypt.compare(pwd, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
