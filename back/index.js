require("dotenv").config();
const http = require("http");
const express = require("express");
const routes = require("./routes");
const cors = require("cors");

const PORT = process.env.PORT || 3333;

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  app.use(cors({ origin: "*" }));
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes(app);

const server = http.createServer(app);
server.listen(PORT);
console.log(`Server execution on port ${PORT}.`);
