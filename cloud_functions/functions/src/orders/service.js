const pool = require("../../config/database");

const createOrder = (orderData, callBack) => {
  const query = `insert into orders(order_amount, order_status, created_at, updated_at, user_id, restaurant_id) values(?,?,?,?,?,?)`;
  pool.query(query, orderData, (error, results, fields) => {
    if (error) {
      callBack(error);
    }
    return callBack(null, results);
  });
};

/**
 * This will insert multiple records
 * @param {*} orderItemsData This will have n * m array => [[ [...], [...], [...] ]]
 * @param {*} callBack it will call the callback function
 */
const createOrderItems = (orderItemsData, callBack) => {
  const query = `insert into order_items(quantity, price, total_price, item_id, order_id) values ?`;
  pool.query(query, [orderItemsData], (error, results, fields) => {
    if (error) {
      callBack(error);
    }
    return callBack(null, results);
  });
};

const getOrderByOrderId = (data, callBack) => {
  pool.query(
    `select * from orders o inner join users u on o.user_id = u.uid inner join restaurants r on o.restaurant_id = r.restaurant_id where o.order_id = ? order by o.updated_at desc`,
    data,
    (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      return callBack(null, results);
    }
  );
};

const getOrderItemsByOrderId = (data, callBack) => {
  pool.query(
    `select * from order_items oi inner join orders o on oi.order_id = o.order_id inner join food_items fi on fi.item_id = oi.item_id inner join restaurants r on o.restaurant_id = r.restaurant_id where oi.order_id = ?`,
    data,
    (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      return callBack(null, results);
    }
  );
};

const getOrdersByRestaurantId = (data, callBack) => {
  pool.query(
    `select * from orders o inner join users u on o.user_id = u.uid inner join restaurants r on o.restaurant_id = r.restaurant_id where o.restaurant_id = ? order by o.updated_at desc`,
    data,
    (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      return callBack(null, results);
    }
  );
};

const getOrdersByUserId = (data, callBack) => {
  pool.query(
    `select * from orders o inner join restaurants r on o.restaurant_id = r.restaurant_id inner join users u on o.user_id = u.uid where o.user_id = ? order by o.updated_at desc`,
    data,
    (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      return callBack(null, results);
    }
  );
};

const updateOrder = (data, callBack) => {
  pool.query(
    `update orders set order_status = ?, updated_at = ? where order_id = ?`,
    data,
    (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      return callBack(null, results);
    }
  );
};

const deleteOrder = (data, callBack) => {
  pool.query(
    `delete from orders where order_id = ?`,
    data,
    (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      return callBack(null, results);
    }
  );
};

const getOrderStatus = (data, callBack) => {
  pool.query(
    `select order_status from orders where order_id = ?`,
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
  createOrder,
  createOrderItems,
  getOrderByOrderId,
  getOrderItemsByOrderId,
  getOrdersByRestaurantId,
  getOrdersByUserId,
  updateOrder,
  deleteOrder,
  getOrderStatus,
};
