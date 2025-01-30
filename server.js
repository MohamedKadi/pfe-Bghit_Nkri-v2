const express = require('express');
const morgan = require('morgan');
const app = express();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

app.use(cookieParser());

require('dotenv').config();

//conncet to db
connect().catch((err) => {
  console.log('error connecting database' + err);
});
async function connect() {
  await mongoose.connect(process.env.DATABASE_URL);
  console.log('db connected');
}

const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const errorController = require('./Controllers/errorController');

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(morgan('dev'));
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/posts', postRoutes);

app.use('*', (req, res, next) => {
  const err = new Error(`Can't find ${req.baseUrl} on this server!`);
  err.status = 'fail';
  err.statusCode = 404;

  next(err);
});

app.use(errorController);

app.listen(process.env.PORT, () => {
  console.log('app is listening on 3334');
});
