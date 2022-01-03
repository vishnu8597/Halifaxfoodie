const { handleError } = require("../../utils/handleError");
const { createOrderReview, getReviewByOrderId } = require("./service");

exports.createOrderFeedback = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { review, rating, orderId } = req.body;
    const orderFeedbackData = [review, rating, userId, orderId];
    createOrderReview(orderFeedbackData, async (err, results) => {
      if (err) {
        return handleError(res, err);
      }
      if (!results) {
        const error = {
          code: "Issue to fetch result",
          message: "Something went wrong",
        };
        return handleError(res, error);
      }
      return res.status(201).json({
        success: true,
        message: "Review created successfully",
      });
    });
  } catch (err) {
    return handleError(res, err);
  }
};

exports.getReviewByOrderId = async (req, res) => {
  try {
    const { order_id } = req.params;
    const data = [order_id];
    getReviewByOrderId(data, (err, results) => {
      if (err) {
        return handleError(res, err);
      }
      if (!results) {
        const error = {
          code: "Issue to fetch result",
          message: "Something went wrong",
        };
        return handleError(res, error);
      }
      return res.status(200).json({
        given: results.length,
        review: results[0] || {},
      });
    });
  } catch (err) {
    return handleError(res, err);
  }
};
