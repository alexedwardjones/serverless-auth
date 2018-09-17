module.exports = (error) => ({
    statusCode: error.statusCode || 500,
    headers: { 'Content-Type': 'text/plain' },
    body: error.message
  });