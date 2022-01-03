exports.isSameUser = (req, res, next) => {
  const { uid } = res.locals;
  const { id } = req.params;
  if (id && uid === id) return next();
  return res.status(403).json({
    success: false,
    message: "You are not authorized to perform this operation",
  });
};
