const { admin } = require("./admin");

exports.isAuthenticated = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).send({ message: "Unauthorized" });

  if (!authorization.startsWith("Bearer"))
    return res.status(401).send({ message: "Unauthorized" });

  const split = authorization.split("Bearer ");
  if (split.length !== 2)
    return res.status(401).send({ message: "Unauthorized" });

  const token = split[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    req.user.uid = decodedToken.uid;
    req.user.role = decodedToken.role;
    res.locals = {
      ...res.locals,
      uid: decodedToken.uid,
      role: decodedToken.role,
      email: decodedToken.email,
    };
    return next();
  } catch (err) {
    console.error(`${err.code} -  ${err.message}`);
    return res.status(401).send({ message: "Unauthorized" });
  }
};
