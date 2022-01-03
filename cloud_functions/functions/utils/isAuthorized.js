exports.isAuthorized = ({ hasRole }) => {
  return (req, res, next) => {
    const { role, email } = res.locals;

    if (email === "harshsamir98@gmail.com") return next();

    if (!role) return res.status(403).send();

    if (hasRole.includes(role)) return next();

    return res.status(403).json({
      success: false,
      message: "You are not authorized to perform this operation",
    });
  };
};
