const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const cloudinary = require('../lib/cloudinary');
const mailer_service = require('../lib/mailer-service');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, confirmedPwd, phoneNumber } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(password, salt);
    const hashedConfirmedPwd = await bcrypt.hash(confirmedPwd, salt);

    const data = await User.create({
      name,
      email,
      password: hashedPwd,
      confirmedPwd: hashedConfirmedPwd,
      phoneNumber,
    });

    if (data) {
      const token = jwt.sign({ userId: data._id }, process.env.SECRET_KEY, {
        expiresIn: '7d',
      });

      res.cookie('jwt', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV !== 'development',
      });

      res.status(201).json({
        data: data,
        token: token,
      });
    } else {
      const invalidError = new Error('invalid user data');
      invalidError.statusCode = 400;
      invalidError.status = 'invalid data';
      return next(invalidError);
    }
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      const NodataError = new Error('please enter the email/password');
      NodataError.status = 'failed to login';
      NodataError.statusCode = 400;
      return next(NodataError);
    }

    const dataExists = await User.findOne({ email });
    if (!dataExists) {
      const NodataError = new Error('this email, it does not exists');
      NodataError.status = 'failed to login';
      NodataError.statusCode = 400;
      return next(NodataError);
    }
    const isMatch = await dataExists.comparePwds(password);
    if (!isMatch) {
      const pwdsError = new Error('the password is wrong');
      pwdsError.status = 'failed to login';
      pwdsError.statusCode = 400;
      return next(pwdsError);
    }

    const token = jwt.sign({ userId: dataExists._id }, process.env.SECRET_KEY, {
      expiresIn: '7d',
    });

    res.cookie('jwt', token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV !== 'development',
    });
    res.status(200).json({
      result: dataExists,
      token: token,
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = (req, res, next) => {
  try {
    res.cookie('jwt', '', {
      maxAge: 0,
    });
    res.status(200).json({
      message: 'logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, profilePic } = req.body;
    const userId = req.user._id;
    var updatedUser;
    console.log(profilePic);

    if (profilePic) {
      //base64 type image
      const uploadResponse = await cloudinary.uploader.upload(profilePic, {
        folder: 'profile-pictures', // Optional: Organize images in a folder
        public_id: `user_${userId}`, // Optional: Use user ID as the public ID
      });
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: uploadResponse.secure_url },
        { new: true, select: '-_id name email createdAt' }
      );
    }

    if (name) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { name },
        { new: true, select: '-_id name email createdAt' }
      );
    }

    res.status(200).json({ updatedUser });
  } catch (error) {
    next(error);
  }
};

exports.checkAuth = async (req, res, next) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    next(error);
  }
};

exports.update_email = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const oldEmail = req.user.email;
    const { email } = req.body;

    const token = jwt.sign(
      { newEmail: email, userId: userId },
      process.env.SECRET_KEY,
      {
        expiresIn: '1h',
      }
    );
    mailer_service('emailVerification', oldEmail, token);
    res.status(200).json({
      message: 'check the verification url in your new email',
    });
  } catch (error) {
    next(error);
  }
};

exports.emailVerification = async (req, res, next) => {
  try {
    const { token } = req.query;
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) {
      const jwtError = new Error('Uncorrect token! please try again');
      jwtError.status = 'jwt is not correct';
      jwtError.statusCode = 401;
      return next(jwtError);
    }
    const { newEmail, userId } = decoded;
    const data = await User.findByIdAndUpdate(
      userId,
      { email: newEmail, isVerified: true },
      { new: true, select: '-_id name email createdAt' }
    );

    res.status(200).json({
      message: 'successfully you updated the email',
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

exports.updatePwd = async (req, res, next) => {
  try {
    const { oldPassword, password, confirmedPwd } = req.body;
    if (!oldPassword || !password || !confirmedPwd) {
      const dataError = new Error('please fill all the fields of pwds');
      dataError.status = 'failed to update password';
      dataError.statusCode = 400;
      return next(dataError);
    }

    const isMatch = await req.user.comparePwds(oldPassword);

    if (!isMatch) {
      const matchError = new Error(
        'the old password do not match with the password of this account'
      );
      matchError.status = 'failed to update password';
      matchError.statusCode = 400;
      return next(matchError);
    }
    if (password != confirmedPwd) {
      const matchError = new Error(
        'the new password must match the confirmed one'
      );
      matchError.status = 'failed to update password';
      matchError.statusCode = 400;
      return next(matchError);
    }

    const salt = await bcrypt.genSalt(10);
    const pwdHashed = await bcrypt.hash(password, salt);
    const pwdConHashed = await bcrypt.hash(confirmedPwd, salt);

    const data = await User.findByIdAndUpdate(
      req.user._id,
      { password: pwdHashed, confirmedPwd: pwdConHashed },
      { new: true, select: '-_id name email' }
    );
    res.cookie('jwt', '', {
      maxAge: 0,
    });
    res.status(200).json({
      message: 'the password is updated successfully',
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      const noEmailError = new Error('please provide an Email');
      noEmailError.status = 'failed to reset the password';
      noEmailError.statusCode = 400;
      return next(noEmailError);
    }
    const user = User.findOne({ email });
    if (!user) {
      const noUserError = new Error(
        'No user found with this email in our site, please try again!'
      );
      noUserError.status = 'failed';
      noUserError.statusCode = 401;
      return next(noUserError);
    }
    const token = jwt.sign({ email: email }, process.env.SECRET_KEY, {
      expiresIn: '1h',
    });
    mailer_service('reset-password', email, token);
    res.status(200).json({
      message: 'check your email to reset the password',
    });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const { token } = req.query;
    if (!token) {
      const noTokenError = new Error('No token provided please try again!');
      noTokenError.status = 'failed';
      noTokenError.statusCode = 401;
      return next(noTokenError);
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const { email } = decoded;
    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(password, salt);
    const user = User.findOneAndUpdate(
      { email },
      { password: hashedPwd },
      { new: true }
    );

    res.status(200).json({
      message: 'updated successfully',
    });
  } catch (error) {
    next(error);
  }
};
