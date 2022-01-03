const pool = require("../../config/database");

const mapQuestionToUser = (userQuestionData, role, callBack) => {
  const query =
    role === "admin"
      ? `insert into restaurant_questions(restaurant_id, question_id, answer) values(?,?,?)`
      : `insert into user_questions(user_id, question_id, answer) values(?,?,?)`;
  pool.query(query, userQuestionData, (error, results, fields) => {
    if (error) {
      callBack(error);
    }
    return callBack(null, results);
  });
};

const getSecurityQuestions = (callBack) => {
  pool.query(`select * from questions`, [], (error, results, fields) => {
    if (error) {
      callBack(error);
    }
    return callBack(null, results);
  });
};

module.exports = {
  mapQuestionToUser,
  getSecurityQuestions,
};
