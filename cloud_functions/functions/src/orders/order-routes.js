const { isAuthenticated } = require("../../utils/isAuthenticated");
const { isAuthorized } = require("../../utils/isAuthorized");
const { isSameUser } = require("../../utils/isSameUser");
const {
  createOrder,
  getOrderByOrderId,
  getOrdersByRestaurant,
  getOrdersByUser,
  updateOrder,
  deleteOrder,
  getOrderStatusByOrderId,
} = require("./controller");

exports.orderRoutes = (app) => {
  // create food order
  app.post("/orders", [
    isAuthenticated,
    isAuthorized({ hasRole: ["user"] }),
    createOrder,
  ]);
  // get order by order id
  app.get("/orders/:order_id", [isAuthenticated, getOrderByOrderId]);
  // get orders by restaurant id
  app.get("/orders/restaurant/:id", [
    isAuthenticated,
    isAuthorized({ hasRole: ["admin", "manager"] }),
    isSameUser,
    getOrdersByRestaurant,
  ]);
  // get orders by user id
  app.get("/orders/user/:id", [
    // isAuthenticated,
    // isAuthorized({ hasRole: ["user"] }),
    // isSameUser,
    getOrdersByUser,
  ]);
  // update order
  app.patch("/orders/:order_id/restaurant/:id", [
    isAuthenticated,
    isAuthorized({ hasRole: ["admin", "manager"] }),
    isSameUser,
    updateOrder,
  ]);
  // deletes :id user
  app.delete("/orders/:order_id/restaurant/:id", [
    isAuthenticated,
    isAuthorized({ hasRole: ["admin", "manager"] }),
    isSameUser,
    deleteOrder,
  ]);
  // get order status
  app.get("/orders/:order_id/track", [
    isAuthenticated,
    getOrderStatusByOrderId,
  ]);
};
