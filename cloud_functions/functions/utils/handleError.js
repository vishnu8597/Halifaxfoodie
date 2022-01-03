exports.handleError = (res, err) => {
  return res.status(500).json({ code: err.code, message: err.message });
};
