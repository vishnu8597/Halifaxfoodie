const { isAuthenticated } = require("../../utils/isAuthenticated");
const { isAuthorized } = require("../../utils/isAuthorized");
const { createOrderFeedback, getReviewByOrderId } = require("./controller");

exports.orderReviewRoutes = (app) => {
  // create food order
  app.post("/order/reviews", [
    isAuthenticated,
    isAuthorized({ hasRole: ["user"] }),
    createOrderFeedback,
  ]);
  app.get("/order/:order_id/reviews", [isAuthenticated, getReviewByOrderId]);
};
