const express = require("express");
const app = express();

const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: "Too many request from this IP, please try again later",
  standardHeaders: true, // if you want to send custom rate limit header response
  legacyHeaders: true, // if you do not want to send expose header
});

express.urlencoded({ extended: true });
express.json();

// app.use(limiter);

const router = require("./src/router/router");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("port", 3000);

app.use("/api", router);

app.listen(app.get("port"), () => {
  console.clear();
  console.log("listening on port", app.get("port"));
});
