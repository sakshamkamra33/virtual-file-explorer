// server/middleware/errorHandler.js

export const errorHandler = (err, req, res, next) => {
  console.error(`❌ Error: ${err.message}`);
  console.error(err.stack);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: statusCode,
      path: req.originalUrl,
    },
  });
};

export const notFound = (req, res, next) => {
  res.status(404).json({
    error: {
      message: `Route not found: ${req.originalUrl}`,
      status: 404,
    },
  });
};