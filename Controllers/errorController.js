module.exports = (err, req, res, next) => {
  if (err.code == 11000) {
    const duplicatedError = new Error('this email already exists please login');
    err = duplicatedError;
    err.status = 'duplicated Email error';
    err.statusCode = 400;
  }
  if (err.name == 'ValidationError') {
    const errors = [];
    for (let key in err.errors) {
      errors.push(err.errors[key].message);
    }
    const msg = 'invalid input ' + errors.join(', ');
    const validationErr = new Error(msg);
    err = validationErr;
    err.statusCode = 400;
    err.status = 'inputs error';
  }
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message || 'Something went wrong',
    stack: err.stack,
  });
};
