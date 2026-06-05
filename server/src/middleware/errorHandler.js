module.exports = function errorHandler(err, _req, res, _next) {
  console.error('🔥 Error:', err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.publicMessage || (status === 500 ? 'Server error' : err.message),
  });
};
