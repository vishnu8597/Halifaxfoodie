const { isAuthenticated } = require("../../utils/isAuthenticated");
const { isAuthorized } = require("../../utils/isAuthorized");
const { isSameUser } = require("../../utils/isSameUser");
const {
  create,
  allFoodItems,
  getFoodItemById,
  getFoodItemsByRestaurant,
  getFeaturedFoodItemsByRestaurant,
  removeFoodItem,
  updateFoodItem,
  uploadFoodItemImage,
} = require("./controller");

exports.foodItemRoutes = (app) => {
  // create food item
  app.post("/food-item/restaurant/:id", [
    isAuthenticated,
    isAuthorized({ hasRole: ["admin", "manager"] }),
    isSameUser,
    create,
  ]);
  // lists all food item
  app.get("/food-item", [isAuthenticated, allFoodItems]);
  // get food items by item id
  app.get("/food-item/item/:item_id", [isAuthenticated, getFoodItemById]);
  // get food items by restaurant id
  app.get("/food-item/restaurant/:restaurant_id", [
    isAuthenticated,
    getFoodItemsByRestaurant,
  ]);
  // get featured food items of restaurants
  app.get("/food-item/featured/restaurant/:restaurant_id", [
    isAuthenticated,
    getFeaturedFoodItemsByRestaurant,
  ]);
  // update food item
  app.patch("/food-item/:item_id/restaurant/:id", [
    isAuthenticated,
    isAuthorized({ hasRole: ["admin", "manager"] }),
    isSameUser,
    updateFoodItem,
  ]);
  // deletes :id user
  app.delete("/food-item/:item_id/restaurant/:id", [
    isAuthenticated,
    isAuthorized({ hasRole: ["admin", "manager"] }),
    isSameUser,
    removeFoodItem,
  ]);
  app.post("/food-item/:item_id/image", [isAuthenticated, uploadFoodItemImage]);
};
