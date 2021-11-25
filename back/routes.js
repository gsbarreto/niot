const userControllers = require("./src/User/controllers");
const iotControllers = require("./src/IoT/controllers");

const privateRoute = require("./utils/privateRoute");

module.exports = (app) => {
  userControllers(app);
  iotControllers(app);

  app.get("/private", privateRoute, (req, res, next) => {
    res.json({ message: "Deu certo!" });
  });
};
