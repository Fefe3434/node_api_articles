const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const NotFoundError = require("./errors/not-found");
const userRouter = require("./api/users/users.router");
const articlesRouter = require("./api/articles/articles.router");
const usersController = require("./api/users/users.controller");
const authMiddleware = require("./middlewares/auth");
require("./api/articles/articles.schema");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("A user connected");
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(cors());
app.use(express.json());

app.post("/", usersController.login); 
app.post("/api/users", usersController.create); 

app.use("/api/users", authMiddleware, userRouter);
app.use("/api/articles", authMiddleware, articlesRouter);

app.use("/", express.static("public"));

app.use((req, res, next) => {
  next(new NotFoundError());
});

app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message;
  res.status(status).json({
    status,
    message,
  });
});

module.exports = {
  app,
  server,
};
