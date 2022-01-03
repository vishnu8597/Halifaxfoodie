const { isAuthenticated } = require("../../utils/isAuthenticated");
const { isAuthorized } = require("../../utils/isAuthorized");
const {
  create,
  all,
  get,
  patch,
  remove,
  uploadImage,
} = require("./controller");

exports.userRoutes = (app) => {
  app.post(
    "/users",
    // isAuthenticated,
    // isAuthorized({ hasRole: ["admin", "manager"] }),
    create
  );
  // lists all users
  app.get("/users", [
    isAuthenticated,
    isAuthorized({ hasRole: ["admin", "manager"] }),
    all,
  ]);
  // get :id user
  app.get("/users/:id", [
    isAuthenticated,
    isAuthorized({ hasRole: ["admin", "manager"], allowSameUser: true }),
    get,
  ]);
  // updates :id user
  app.patch("/users/:id", [
    isAuthenticated,
    isAuthorized({ hasRole: ["admin", "manager"], allowSameUser: true }),
    patch,
  ]);
  // deletes :id user
  app.delete("/users/:id", [
    isAuthenticated,
    isAuthorized({ hasRole: ["admin", "manager"] }),
    remove,
  ]);
  app.post("/users/image", [isAuthenticated, uploadImage]);
};
