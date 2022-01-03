const { getAllQuestions } = require("./controller");

exports.questionRoutes = (app) => {
  app.get("/questions", getAllQuestions);
};
