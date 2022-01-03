const pool = require("../../config/database");

const createOrderReview = (orderFeedbackData, callBack) => {
  const query = `insert into order_feedback(comment, rating, user_id, order_id) values(?,?,?,?)`;
  pool.query(query, orderFeedbackData, (error, results, fields) => {
    if (error) {
      callBack(error);
    }
    return callBack(null, results);
  });
};

const getReviewByOrderId = (data, callBack) => {
  pool.query(
    `select * from order_feedback where order_id = ?`,
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
  createOrderReview,
  getReviewByOrderId,
};
