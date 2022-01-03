const { isAuthenticated } = require("../../utils/isAuthenticated");
const {
  publishMessage,
  pushDelivery,
  pullDelivery,
  createSubscription,
  createTopic,
} = require("./controller");

exports.chatRoutes = (app) => {
  app.post("/chat/topic", isAuthenticated, createTopic);
  app.post("/chat/subscription", isAuthenticated, createSubscription);
  app.post("/chat", isAuthenticated, publishMessage);
  app.get("/chat/pull", isAuthenticated, pullDelivery);
  app.post("/chat/push", isAuthenticated, pushDelivery);
};
