const { isAuthenticated } = require("../../utils/isAuthenticated");
const { isAuthorized } = require("../../utils/isAuthorized");
const { isSameUser } = require("../../utils/isSameUser");
const { all, get, remove } = require("./controller");

exports.restaurantRoutes = (app) => {
  // lists all restaurants
  app.get("/restaurants", [isAuthenticated, all]);
  // get :id user
  app.get("/restaurants/:id", [isAuthenticated, get]);
  // deletes :id user
  app.delete("/restaurants/:id", [
    isAuthenticated,
    isAuthorized({ hasRole: ["admin", "manager"] }),
    isSameUser,
    remove,
  ]);
};
