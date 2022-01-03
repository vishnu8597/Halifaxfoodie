const pool = require("../../config/database");

const getAllRestaurants = (callBack) => {
  pool.query(`select * from restaurants`, [], (error, results, fields) => {
    if (error) {
      callBack(error);
    }
    return callBack(null, results);
  });
};

const getRestaurantById = (data, callBack) => {
  pool.query(
    `select * from restaurants where restaurant_id = ?`,
    data,
    (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      return callBack(null, results);
    }
  );
};

const deleteRestaurant = (data, callBack) => {
  pool.query(
    `delete from restaurants where restaurant_id = ?`,
    data,
    (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      return callBack(null, results);
    }
  );
};

module.exports = {
  getAllRestaurants,
  getRestaurantById,
  deleteRestaurant,
};
