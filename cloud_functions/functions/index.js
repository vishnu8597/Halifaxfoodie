const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const { userRoutes } = require("./src/users/user-routes");
const { questionRoutes } = require("./src/questions/question-routes");
const { chatRoutes } = require("./src/chat/chat-routes");
const { restaurantRoutes } = require("./src/restaurants/restaurants-routes");
const { foodItemRoutes } = require("./src/food_items/food-items-routes");
const { orderRoutes } = require("./src/orders/order-routes");
const {
  orderReviewRoutes,
} = require("./src/order_reviews/order-review-routes");

const app = express();

app.use(bodyParser.json());
app.use(cors());
userRoutes(app);
questionRoutes(app);
chatRoutes(app);
restaurantRoutes(app);
foodItemRoutes(app);
orderRoutes(app);
orderReviewRoutes(app);

exports.api = functions.https.onRequest(app);
