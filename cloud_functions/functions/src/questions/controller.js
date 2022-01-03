const { handleError } = require("../../utils/handleError");
const { getSecurityQuestions } = require("./service");

exports.getAllQuestions = async (req, res) => {
  try {
    getSecurityQuestions((err, results) => {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(results);
    });
  } catch (err) {
    return handleError(res, err);
  }
};
